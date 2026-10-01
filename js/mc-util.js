(function (window) {
    var mc = {};
    if (window.mc) {
        mc = window.mc
    }

    /**
     * @description 数字滚动 需引入appear.js 并在元素上加上data-num属性
     *
     * @param {Document} obj - js DOM对象选择器
     */
    mc.numRoll = function (obj) {
        var $obj = $(obj);
        $obj.appear(function () {
            var content = $(this).text();
            var counter = parseInt($(this).text().replace(/,/g, ""));
            $(this).countTo({
                from: 1,
                to: counter,
                speed: 1500,
                refreshInterval: 60,
                onComplete: function () {
                    $(this).text(content);
                }
            });
        });
    }
    // 手机端视频不自动播放
    mc.phVideo = function () {
        if ($(window).width() < 768 && $("video").length > 0) {
            $("video").each(function () {
                $(this).removeAttr("autoplay");
                $(this).get(0).pause();
            })
        }
    }
    /**
     * @description 轮播视频相关初始化
     *
     * @param {*} obj - js DOM轮播对象选择器
     */
    mc.banVideo = function (obj) {
        var $obj = $(obj);
        if ($(window).width() > 1200 && $obj.find("video").length > 0) {
            var $firSlide = $(obj).find(".slick-slide").not(".slick-cloned").eq(0);
            // autoplay自动播放
            $(window).load(function () {
                if ($firSlide.find("video").length > 0) {
                    $obj.slick('slickPause');
                    if ($firSlide.find("video").get(0).paused) {
                        setTimeout(function () {
                            $firSlide.find("video").get(0).play();
                        }, 100)
                    }
                } else {
                    $obj.slick('slickPlay');
                }
            })

            $obj.find("video").each(function () {

                var video = $(this).get(0); //获取视频js对象
                var videoIndex = $(video).parents(".slick-slide").attr("data-slick-index") //获取视频对象所在的页数;

                // 播放结束切换到下一张
                video.onended = function () {
                    $obj.slick("next");
                    $obj.slick('slickPlay');
                }
                // 切换后转为自动轮播
                $obj.on('afterChange', function (event, slick, currentSlide) {
                    if (currentSlide == videoIndex) {
                        $obj.slick('slickPause');
                        video.currentTime = 0;
                        video.play();
                    }
                });
            })
        } else {
            $obj.slick('slickPlay');
        }
    }

    //下拉选择
    mc.select = function (obj) {
        var $obj = $(obj);
        $obj.find(".mc_select_hd").click(function (e) {
            var target = $(this).siblings(".mc_select_bd").get(0);
            $(".mc_select_bd").not(target).stop().slideUp();
            $(this).siblings(".mc_select_bd").stop().slideToggle();
            // 图标旋转
            $(this).find(".mc_select_xtb").toggleClass("on");
            e.stopPropagation();
        })
        $obj.find(".mc_select_li").click(function () {
            var selectShow = $(this).text();
            $(this).parents(".mc_select_bd").siblings(".mc_select_hd").find(".mc_select_show").val(selectShow);
            // $(this).parents(".mc_select_bd").slideUp();
        })
        // 点击页面关闭
        $("body").click(function () {
            $(".mc_select_bd").stop().slideUp();
            $(".mc_select_xtb").removeClass("on");
        })
    }

    // 瀑布流
    mc.warterfall = function (obj) {
        var $obj = $(obj);
        wfInit();
        $(window).load(function () {
            wfInit();
        })
        $(window).resize(function () {
            wfInit();
        })

        function wfInit() {
            // 瀑布流宽度
            var wfWidth = $obj.width();
            var item = $obj.children();
            var itemWidth = item.outerWidth();
            //一行放几个
            var count = Math.round(wfWidth / itemWidth);

            // 定义一个数组index*width为item横坐标，值为item纵坐标
            var heightArr = [];
            for (var i = 0; i < count; i++) {
                heightArr[i] = 0;
            }

            item.each(function () {

                var minAndIndexArr = minAndIndex(heightArr);
                var minHeihgt = minAndIndexArr[0];
                var index = minAndIndexArr[1];

                $(this).css("left", index * itemWidth);
                $(this).css("top", minHeihgt);

                var itemMargin = parseFloat($(this).css("marginTop")) + parseFloat($(this).css("marginBottom"));

                heightArr[index] += $(this).height() + itemMargin;

                var maxHeihgt = Math.max.apply(null, heightArr);
                $obj.height(maxHeihgt);
            })

        }
        // 获取数组的最小高度和它的索引
        function minAndIndex(arr) {
            var minHeihgt = Math.min.apply(null, arr);
            var index = arr.indexOf(minHeihgt);
            var minAndIndexArr = [minHeihgt, index];
            return minAndIndexArr;
        }
    }

    // tab栏
    mc.tab = function (obj) {
        var $obj = $(obj);
        $obj.find(".mc_tabhd_li").click(function () {
            var index = $(this).index();
            $(this).addClass("on").siblings().removeClass("on");
            $(this).parents(obj).find(".mc_tabbd_lisbox").eq(index).stop().fadeIn().siblings().stop().hide();
        });
    }

    /**
     * @description 将到1970年的毫秒数转换为天,时，分，秒的格式
     *
     * @param {*} date 日期到1970年的毫秒数
     * @returns 数组[day, hour, min, sec]
     */
    mc.dateFormart = function (date) {
        var day = Math.floor(date / (86400000));
        var hour = Math.floor(date % (86400000) / (3600000));
        var min = Math.floor(date % (3600000) / 60000);
        var sec = Math.floor(date % (60000) / 1000);

        return [day, hour, min, sec];
    }


    /**
     * @description 弹窗蒙层
     *
     * @param {String} btn  弹窗触发按钮（选择器） 
     * @param {String} modal     对应弹窗（选择器）
     * @param {Boolean} modalClose  点击蒙层非内容部分是否可关闭（默认为否）
     */
    var Modal = {
        $html: $("html"),
        $body: $(document.body),
        originalBodyPad: null,
        scrollbarWidth: 0,
        show: function () {
            this.checkScrollbar()
            this.setScrollbar()
            this.$html.addClass('modal-open')
        },
        hide: function () {
            this.$html.removeClass('modal-open')
            this.resetScrollbar();
        },
        checkScrollbar: function () {
            var fullWindowWidth = window.innerWidth
            if (!fullWindowWidth) { // workaround for missing window.innerWidth in IE8
                var documentElementRect = document.documentElement.getBoundingClientRect();
                fullWindowWidth = documentElementRect.right - Math.abs(documentElementRect.left);
            }
            this.bodyIsOverflowing = document.body.clientWidth < fullWindowWidth;
            this.scrollbarWidth = this.measureScrollbar();
        },
        setScrollbar: function () {
            var bodyPad = parseInt((this.$body.css('padding-right') || 0), 10)
            this.originalBodyPad = document.body.style.paddingRight || ''
            if (this.bodyIsOverflowing) this.$body.css('padding-right', bodyPad + this.scrollbarWidth)
        },
        measureScrollbar: function () {
            var scrollDiv = document.createElement('div');
            scrollDiv.className = 'modal-scrollbar-measure';
            this.$body.append(scrollDiv);
            var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
            this.$body[0].removeChild(scrollDiv);
            return scrollbarWidth;
        },
        resetScrollbar: function () {
            this.$body.css('padding-right', this.originalBodyPad);
        }
    }

    mc.Modal = Modal;

    mc.modal = function (btn, modal, modalClose) {

        var $modal = $(modal);
        var $btn = $(btn);
        // 显示
        $btn.click(function (e) {
            e = e || window.event;
            e.stopPropagation();
            $modal.stop().fadeIn();
            Modal.show();
        });
        // 关闭
        $(".mc_modal_close").click(function () {
            $modal.stop().fadeOut(function () {
                Modal.hide();
            });
        });
        if (modalClose) {
            $modal.click(function () {
                $modal.stop().fadeOut(function () {
                    Modal.hide();
                });
            })
        }
        // 取消冒泡
        $(".mc_modal_container").click(function (e) {
            e = e || window.event;
            e.stopPropagation();
        })
    }

    //侧边导航
    function asideNav() {
        $(window).load(function () {
            var topArr = [];
            var navHeight = $(".mc_pc_hd").height();
            $(".mc_section").each(function () {
                var top = $(this).offset().top;
                topArr.push(top);
            });

             // 导航位置不进入banner和footer
             var cen1 = $(".mc_main").offset().top - $(".mc_navbar").height();
             var cen2 = $(".mc_ft").offset().top - $(".mc_asidebox").height() - parseInt($(".mc_asidebox").css("bottom")) - $(".mc_asidebox").get(0).offsetTop;

            // 进入页面初始化
            asideNavPosition();
            asideNavTb();
            //导航点击
            $(".mc_aside_li").click(function () {
                var index = $(this).index();
                $("html,body").stop().animate({
                    "scrollTop": topArr[index] - navHeight
                }, 500);
            });
            $(".mc_asidebox").stop().fadeIn();

            // 滚动事件监听
            $(window).scroll(function () {
                // 导航位置
                asideNavPosition();
                //左侧样式同步
                asideNavTb();
            });


            function asideNavPosition() {
                if ($(window).scrollTop() > cen2) {
                    $(".mc_asidebox").addClass("mc_bot").removeClass("mc_fixed");
                } else if ($(window).scrollTop() > cen1) {
                    $(".mc_asidebox").addClass("mc_fixed").removeClass("mc_bot");
                } else {
                    $(".mc_asidebox").removeClass("mc_fixed").removeClass("mc_bot");
                }
            };
            //左侧样式同步
            function asideNavTb() {
                for (var i = 0; i < topArr.length; i++) {
                    if ($(window).scrollTop() > topArr[i] - $(window).height() / 3) {
                        $(".mc_aside_li").eq(i).addClass("on").siblings().removeClass("on");
                    } else {
                        return;
                    }
                }
            }
        })

    }

    window.mc = mc;
}(window))


// slick常用方法
function slickInit() {
    // 轮播初始化
    $('.mc_banner_slick').slick({
        dots: true,
        arrows: true,
        autoPlay: true,
        // vertical: true,
        // slidesToShow: 1,
        // slidesToScroll: 1,
        // asNavFor: ".s3_subcontent ul,.s3_img_slide",
        // responsive: [{
        //     breakpoint: 1200,
        //     settings: {
        //         slidesToShow: 1
        //     }
        // }, ]
    });
    //上一张 下一张
    $('.mc_banner_slick').slick("prev");
    $('.mc_banner_slick').slick("next");
    // 到哪一张
    $(".mc_banner_slick").slick("slickGoTo", index)
    //翻页完成后执行
    $(".mc_banner_slick").on('afterChange', function (event, slick, currentSlide, nextSlide) {
        var index = currentSlide;
    });
    //开始停止自动播放
    $obj.slick('slickPause');
    $obj.slick('slickPlay');
}
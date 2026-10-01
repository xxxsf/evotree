$(function () {
    // wow初始化
    new WOW().init();
    // 手机导航下拉
    phMenu();
    //手机端视频不自动播放
    mc.phVideo();
    // pc导航条相关
    pcNav();
})


// 手机导航下拉
function phMenu() {
    // ph导航
    $(".mc_ph_menu").click(function () {
        $(this).find(".point").toggleClass("active");
        $(".xialaph").slideToggle();
        $(".phonemeng").toggleClass('active');
        $("body,html").animate({
            scrollTop: 0
        }, 500);
    });
    // ph导航二级
    $(".xialaph  h4").click(function () {
        $(this).siblings(".ul2").slideToggle();
        $(this).parent().parent().siblings().find(".ul2").slideUp();
        $(this).toggleClass("active");
        $(this).parent().parent().siblings().find("h4,h5").removeClass('active');
    });
    /*ph导航三级*/
    $(".xialaph h5").click(function () {
        $(this).siblings(".ul3").slideToggle();
        $(this).parent().siblings().find(".ul3").slideUp();
        $(this).toggleClass("active");
        $(this).parent().siblings().find("h4,h5").removeClass('active');
    });
}
// pc导航条相关
function pcNav() {
    // 顶部跟随
    navFixed();
    $(window).scroll(function () {
        navFixed();
    })

    function navFixed() {
        var isInnerPage = $(".page-hero").length > 0;
        if ($(window).scrollTop() > 0 || isInnerPage) {
            $(".mc_navbar").addClass("mc_fixed");
            $(".mc_container_hd").removeClass("mc_cont_zk");
        } else {
            $(".mc_navbar").removeClass("mc_fixed");
            $(".mc_container_hd").addClass("mc_cont_zk");
        }
    }
    $(".mc_navbar").hover(
        function () {
            $(".mc_navbar").addClass("mc_fixed");
        },
        function () {
            if ($(window).scrollTop() <= 0 && !$(".page-hero").length) {
                $(".mc_navbar").removeClass("mc_fixed");
            }
        }
    )

    // 导航下拉
    $(".mc_nav_li").hover(
        function () {
            $(this).find(".mc_nav_xl").stop().slideDown();
        },
        function () {
            $(this).find(".mc_nav_xl").stop().slideUp();
        }
    )

    // 搜索下拉
    var isHide = true;
    $(".mc_search_btn").click(function (e) {
        e.stopPropagation();
        if (isHide) {
            $(".mc_search_btn").addClass("mc_act");
            $(".mc_search_xl").stop().slideDown();
            isHide = false;
        } else {
            $(".mc_search_btn").removeClass("mc_act");
            $(".mc_search_xl").stop().slideUp();
            isHide = true;
        }
    })
    $(".mc_search_xl").click(function (e) {
        e.stopPropagation();
    })
    $("body").click(function () {
        $(".mc_search_btn").removeClass("mc_act");
        $(".mc_search_xl").stop().slideUp();
        isHide = true;
    })

    // 底部二维码
    $(".ma_ftt2li").hover(function(){
        $(this).find(".ma_ftt2libtm").stop().fadeIn();
    },function(){
        $(this).find(".ma_ftt2libtm").stop().fadeOut();
    })

}

// 锚点
function yxtop() {
    $(window).load(function () {
        var test = (window.location.href).split('add');
        if (!isNaN(test[1])) {
            $("html,body").animate({
                scrollTop: $('[yxdatop-pag="' + test[1] + '"]').offset().top - 90
            }, 700);
        }
    })
};
// commom
    $('.g2_piaonr').hover(function(){
        $(this).find('.g2_piaonr1_tu, .g2_piaonr2_wz, .g2_piaonr3_nr').stop().fadeIn();
        $(this).stop().addClass('on');
    }, function(){
        $(this).find('.g2_piaonr1_tu, .g2_piaonr2_wz, .g2_piaonr3_nr').stop().fadeOut();
        $(this).stop().removeClass('on');
    })
    // 返回顶部
    var sTop=document.body.scrollTop||document.documentElement.scrollTop;;
    $('.g2_piaonr4').click(function () {
        var termId = setInterval(function(){
            sTop-=50;
            if(sTop<=0){
                clearInterval(termId);
            }
            window.scrollTo(0,sTop);
        },1);
    });
     $('.g2_piaonr4').click(function(){
       $("html,body").animate({scrollTop: 0}, 500);
    });

    // 2021.6.7 helen star

    $(function(){
        asideNav();
    })
    
    function asideNav() {
    
        asideShow();
    
        $(window).resize(function () {
            asideShow();
        })
    
        $(window).scroll(function () {
            asideShow();
        })
    
        function asideShow() {
            var top = $(".mc_main").offset().top - $(window).height() / 2 + $(".g2_piao").height() / 2;
            if ($(window).scrollTop() > top) {
                $(".g2_piao").addClass("he_add");
            } else {
                $(".g2_piao").removeClass("he_add");
            }
        }
    }
    

    // 2021.6.7 helen end

// 鼠标右键禁用 8.26 grace
if (window.Event) {
    document.captureEvents(Event.MOUSEUP);
}
function nocontextmenu() {
    event.cancelBubble = true
    event.returnValue = false;
    return false;
}
function norightclick(e) {
    if (window.Event) {
        if (e.which == 2 || e.which == 3)
            return false;
    } else if (event.button == 2 || event.button == 3) {
        event.cancelBubble = true
        event.returnValue = false;
        return false;
    }
}
document.oncontextmenu = nocontextmenu; // for IE5+
document.onmousedown = norightclick; // for all others


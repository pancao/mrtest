import splashLayer from '../assets/mockups/splash_layer0.png'
import feedLayer from '../assets/mockups/feed_layer0.png'
import bannerLayer from '../assets/mockups/banner_layer0.png'
import playerLayer from '../assets/mockups/player_layer0.png'
import barsLayer from '../assets/mockups/bars_layer0.png'

export const resourceTypes = [
  {
    id: 1,
    name: '开屏画报',
    size: '1152x2048',
    description: '开机3秒图片或者视频，触达全站听众，点击可跳转品牌播客主页',
    specs: {
      format: ['JPG', 'PNG', 'MP4'],
      maxSize: '20MB',
      requirements: [
        '安全区尺寸为903×1676px，此区域会完整展示在开屏中。如出现文字、LOGO请放置在安全区中',
        '跳转按钮的颜色和文字颜色可定义；请分别提供两个16进制与透明度的色值',
        '其余请遵循主视觉规范',
        '请勿自行增加按钮等点击引导的文案'
      ],
      video: {
        duration: null,
        fps: null,
        audio: false
      }
    },
    image: null,
    mockupLayer: splashLayer,
    previewConfig: {
      bazelVisible: true,
      imageStyle: {
        width: '81%',
        height: '95.1%',
        objectFit: 'cover',
        transformOrigin: 'center',
        marginTop: '4.4%',
        marginLeft: '9.4%',
        borderRadius: '10%'
      },
      uiLayer: {
        visible: true,
        zIndex: 3,
        style: {
          top: '2.5%',
          left: '11.1%',
          width: '78%',
          height: '95%',
          objectFit: 'contain'
        }
      },
      customElements: {
        button: {
          text: '立即体验',
          maxLength: 10,
          visible: true,
          style: {
            backgroundColor: 'rgba(37, 180, 225, 0.6)',
            color: '#ffffff',
            borderRadius: '0.3em',
            padding: '0.9em 1.2em',
            position: 'absolute',
            bottom: '15.8%',
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '2.43em',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: '80%'
          }
        }
      },
      configLabels: {
        colors: {
          title: '颜色设置',
          main: '主题色'
        },
        elements: {
          title: '跳转',
          button: '跳转按钮'
        }
      }
    }
  },
  {
    id: 3,
    name: '品牌开屏滑动样式',
    size: '1152x2048',
    description: '应用场景：应用启动时的开屏画报，支持滑动展示，建议使用竖向大图。',
    specs: {
      format: ['JPG', 'PNG', 'MP4'],
      maxSize: '20MB',
      requirements: [
        '安全区尺寸为903×1676px，此区域会完整展示在开屏中。如出现文字、LOGO请放置在安全区中',
        '上滑跳转过程中，页面有一个过渡浮层，浮层颜色默认跟随系统模式(黑夜/白天)，如需自定义，请提供 16 进制色值',
        '其余请遵循主视觉规范',
        '请勿自行增加按钮等点击引导的文案'
      ],
      video: {
        duration: null,
        fps: null,
        audio: false
      }
    },
    image: null,
    mockupLayer: splashLayer,
    previewConfig: {
      bazelVisible: true,
      imageStyle: {
        width: '81%',
        height: '95.1%',
        objectFit: 'cover',
        transformOrigin: 'center',
        marginTop: '4.4%',
        marginLeft: '9.4%',
        borderRadius: '10%'
      },
      middleLayer: {
        visible: true,
        zIndex: 2,
        style: {
          top: '4.4%',
          left: '9.4%',
          width: '81%',
          height: '95.1%',
          opacity: 0.6
        },
        gradients: {
          mask: {
            visible: true,
            color: '#000000',
            opacity: 0.6,
            style: {
              background: `linear-gradient(0deg, #000 0%, rgba(0, 0, 0, 0.00) 100%)`,
              position: 'absolute',
              top: '68%',
              left: '0',
              width: '100%',
              height: '30%',
              borderRadius: '0 0 18% 18%'
            }
          }
        }
      },
      uiLayer: {
        visible: true,
        zIndex: 3,
        style: {
          top: '2.5%',
          left: '11.1%',
          width: '78%',
          height: '95%',
          objectFit: 'contain'
        }
      },
      configLabels: {
        gradients: {
          title: '遮罩',
          mask: {
            color: '遮罩颜色',
            opacity: '遮罩透明度'
          }
        },
        elements: {
          title: '文案',
          mainTitle: '主标题',
          subTitle: '副标题'
        }
      },
      customElements: {
        icon: {
          text: '',
          maxLength: 0,
          visible: true,
          editable: false,
          style: {
            position: 'absolute',
            bottom: '22%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '60px',
            height: '24px',
            background: `url('data:image/svg+xml,${encodeURIComponent(`<svg width="26" height="10" viewBox="0 0 26 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M12.0715 0.678808C12.6675 0.440397 13.3324 0.440397 13.9285 0.678808L23.9285 4.67881C25.2104 5.19159 25.834 6.64652 25.3212 7.92848C24.8084 9.21044 23.3535 9.83398 22.0715 9.32119L13 5.69258L3.92847 9.32119C2.64651 9.83398 1.19159 9.21044 0.678802 7.92848C0.166018 6.64652 0.789558 5.19159 2.07152 4.67881L12.0715 0.678808Z" fill="white" fill-opacity="0.6"/></svg>`)}')`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundSize: 'contain',
            pointerEvents: 'none'
          }
        },
        mainTitle: {
          text: '向上滑动查看更多',
          maxLength: 20,
          visible: true,
          editable: 'text-only',
          style: {
            position: 'absolute',
            bottom: '17.4%',
            left: '50%',
            transform: 'translateX(-50%)',
            color: '#ffffff',
            fontSize: '2.43em',
            fontWeight: '600',
            whiteSpace: 'nowrap',
            textAlign: 'center',
            pointerEvents: 'none',
            textShadow: '0px 0px 3px rgba(0, 0, 0, 0.25)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: '80%'
          }
        },
        subTitle: {
          text: '了解更多品牌故事',
          maxLength: 20,
          visible: true,
          editable: 'text-only',
          style: {
            position: 'absolute',
            bottom: '15.2%',
            left: '50%',
            transform: 'translateX(-50%)',
            color: 'rgba(255, 255, 255, 1)',
            fontSize: '1.8em',
            fontWeight: '600',
            whiteSpace: 'nowrap',
            textAlign: 'center',
            pointerEvents: 'none',
            textShadow: '0px 0px 3px rgba(0, 0, 0, 0.25)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: '80%'
          }
        }
      }
    }
  },
//   {
//     id: 3,
//     name: '定制单集',
//     size: '1242x644',
//     description: '应用场景：信息流中的图文广告，支持标题、描述文案和按钮的自定义，建议使用横向大图。',
//     specs: {
//       format: ['JPG', 'PNG'],
//       maxSize: '2MB',
//       requirements: [
//         '建议使用横向大图',
//         '保持图片主体内容清晰可见',
//         '避免文字密集'
//       ]
//     },
//     image: null,
//     mockupLayer: feedLayer,
//     previewConfig: {
//       imageStyle: {
//         width: '100%',
//         height: '100%',
//         objectFit: 'contain'
//       },
//       imagePosition: {
//         top: '20%',
//         left: '0',
//         width: '100%',
//         height: '60%'
//       },
//       uiLayer: {
//         visible: true,
//         zIndex: 2
//       },
//       customElements: {
//         title: {
//           text: '广告标题',
//           maxLength: 12,
//           visible: true,
//           style: {
//             color: '#333333',
//             fontSize: '1.2em',
//             fontWeight: 'bold',
//             position: 'absolute',
//             top: '5%',
//             left: '5%',
//             whiteSpace: 'nowrap'
//           }
//         },
//         description: {
//           text: '广告描述文案',
//           maxLength: 20,
//           visible: true,
//           style: {
//             color: '#666666',
//             fontSize: '1em',
//             position: 'absolute',
//             top: '15%',
//             left: '5%',
//             maxWidth: '90%',
//             lineHeight: '1.4'
//           }
//         },
//         button: {
//           text: '了解更多',
//           maxLength: 4,
//           visible: true,
//           style: {
//             backgroundColor: 'rgba(64, 169, 255, 0.9)',
//             color: '#ffffff',
//             borderRadius: '0.25em',
//             padding: '0.5em 1em',
//             position: 'absolute',
//             bottom: '10%',
//             right: '5%',
//             fontSize: '0.9em',
//             whiteSpace: 'nowrap'
//           }
//         }
//       }
//     }
//   },
//   {
//     id: 4,
//     name: 'Banner广告',
//     size: '1242x200',
//     description: '应用场景：页面顶部或底部的横幅广告，建议使用简洁的横向设计。',
//     specs: {
//       format: ['JPG', 'PNG'],
//       maxSize: '2MB',
//       requirements: [
//         '建议使用横向设计',
//         '保持重要内容在安全区域内',
//         '避免过于复杂的背景',
//         '文字内容清晰可见'
//       ]
//     },
//     image: null,
//     mockupLayer: bannerLayer,
//     previewConfig: {
//       imageStyle: {
//         width: '100%',
//         height: '100%',
//         objectFit: 'contain'
//       },
//       imagePosition: {
//         top: '10%',
//         left: '5%',
//         width: '90%',
//         height: '80%'
//       },
//       uiLayer: {
//         visible: true,
//         zIndex: 2
//       }
//     }
//   },
  {
    id: 5,
    name: '播客画布',
    size: '1125x2436',
    description: '针对合作单集设置，在单集播放页通过背景动态画面呈现效果',
    specs: {
      format: ['JPG', 'PNG'],
      maxSize: '5MB',
      requirements: [
        '此处图片为背景氛围图，请勿在图片中出现品牌标识，传达信息的文字、产品图片等',
        'LOGO会由系统自动添加，无需在素材中呈现',
        '如有主体，需要放置在上1/2，否则会被界面元素遮盖'
      ]
    },
    image: null,
    mockupLayer: playerLayer,
    previewConfig: {
      bazelVisible: true,
      imageStyle: {
        width: '80%',
        height: '79.9%',
        left: '10.1%',
        top: '10%',
        objectFit: 'cover',
        borderRadius: '8%'
      },
      middleLayer: {
        visible: true,
        zIndex: 2,
        style: {
          top: '10%',
          left: '10.2%',
          width: '79.6%',
          height: '80%',
        },
        gradients: {
          bottom: {
            visible: true,
            style: {
              background: `linear-gradient(
                to bottom,
                rgba(0, 0, 0, 0) 0%,
                rgba(0, 0, 0, 0.11) 11.46%,
                rgba(0, 0, 0, 0.31) 24.48%,
                rgba(0, 0, 0, 0.48) 36.46%,
                rgba(0, 0, 0, 0.63) 48.35%,
                rgba(0, 0, 0, 0.74) 58.55%,
                rgba(0, 0, 0, 0.85) 71.53%,
                rgba(0, 0, 0, 0.95) 100%
              )`,
              top: '39%',
              height: '61%',
              position: 'absolute',
              left: '0',
              width: '100%'
            }
          },
          top: {
            visible: true,
            color: '#25b4e1',
            style: {
              top: '39%',
              height: '61%',
              opacity: 0.2,
              position: 'absolute',
              left: '0',
              width: '100%',
              background: `linear-gradient(
                to bottom,
                rgba(0, 0, 0, 0) 0%,
                rgba(0, 0, 0, 0.11) 11.46%,
                rgba(0, 0, 0, 0.31) 24.48%,
                rgba(0, 0, 0, 0.48) 36.46%,
                rgba(0, 0, 0, 0.63) 48.35%,
                rgba(0, 0, 0, 0.74) 58.55%,
                rgba(0, 0, 0, 0.85) 71.53%,
                rgba(0, 0, 0, 0.95) 100%
              )`
            }
          }
        }
      },
      uiLayer: {
        visible: true,
        zIndex: 3,
        style: {
          top: '10%',
          left: '10.2%',
          width: '79.6%',
          height: '80%',
          borderRadius: '8%',
          objectFit: 'contain'
        }
      },
      configLabels: {
        colors: {
          title: '颜色设置',
          main: '主题色'
        },
        elements: {
          title: '播放信息',
          coverImage: '封面图',
          episodeTitle: '单集标题',
          podcastName: '播客名称',
          progressBar: '进度条'
        }
      },
      customElements: {
        coverImage: {
          image: null,
          visible: true,
          editable: true,
          style: {
            position: 'absolute',
            top: '46.5%',
            left: '4%',
            width: '123px',
            height: '123px',
            borderRadius: '23px',
            objectFit: 'cover',
            backgroundColor: '#25b4e1',
            overflow: 'hidden',
            boxShadow: '0px 5px 40px 0px rgba(0, 0, 0, 0.60)'
          }
        },
        episodeTitle: {
          text: '要试一试，才知道精神能引领身体走到哪里',
          maxLength: 40,
          visible: true,
          editable: 'text-only',
          style: {
            position: 'absolute',
            top: '52.8%',
            left: '4.1%',
            color: '#ffffff',
            fontSize: '45px',
            fontWeight: '700',
            whiteSpace: 'pre-wrap',
            textAlign: 'left',
            width: '90%',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            lineHeight: '149%',
            WebkitLineClamp: 2,
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            userSelect: 'none'
          }
        },
        podcastName: {
          text: '这是播客节目名称',
          maxLength: 20,
          visible: true,
          editable: 'text-only',
          style: {
            position: 'absolute',
            bottom: '38%',
            left: '4%',
            color: '#25b4e1',
            fontSize: '40px',
            fontWeight: '700',
            whiteSpace: 'nowrap',
            textAlign: 'center',
            userSelect: 'none'
          }
        },
        progressBar: {
          image: `data:image/svg+xml;base64,${btoa(`<svg width="133" height="45" viewBox="0 0 133 45" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect y="37" width="5" height="8" rx="2.5" fill="#25b4e1"/>
            <rect x="8" y="29" width="5" height="16" rx="2.5" fill="#25b4e1"/>
            <rect x="16" y="30" width="5" height="15" rx="2.5" fill="#25b4e1"/>
            <rect x="24" y="26" width="5" height="19" rx="2.5" fill="#25b4e1"/>
            <rect x="32" y="18" width="5" height="27" rx="2.5" fill="#25b4e1"/>
            <rect x="40" y="17" width="5" height="28" rx="2.5" fill="#25b4e1"/>
            <rect x="48" y="29" width="5" height="16" rx="2.5" fill="#25b4e1"/>
            <rect x="56" y="31" width="5" height="14" rx="2.5" fill="#25b4e1"/>
            <rect x="64" y="29" width="5" height="16" rx="2.5" fill="#25b4e1"/>
            <rect x="72" y="29" width="5" height="16" rx="2.5" fill="#25b4e1"/>
            <rect x="80" y="28" width="5" height="17" rx="2.5" fill="#25b4e1"/>
            <rect x="88" y="30" width="5" height="15" rx="2.5" fill="#25b4e1"/>
            <rect x="96" y="29" width="5" height="16" rx="2.5" fill="#25b4e1"/>
            <rect x="104" y="23" width="5" height="22" rx="2.5" fill="#25b4e1"/>
            <rect x="112" y="14" width="5" height="31" rx="2.5" fill="#25b4e1"/>
            <rect x="120" y="4" width="5" height="41" rx="2.5" fill="#25b4e1"/>
            <rect x="128" width="5" height="45" rx="2.5" fill="#25b4e1"/>
          </svg>`)}`,
          visible: true,
          editable: false,
          style: {
            position: 'absolute',
            bottom: '28%',
            left: '-17.7%',
            width: '80%',
            height: '100px'
          }
        }
      }
    }
  },
  {
    id: 6,
    name: '动态播客画布',
    size: '1080x1920',
    description: '针对合作单集设置，在单集播放页通过背景动态画面呈现效果',
    specs: {
      format: ['MP4'],
      maxSize: '10MB',
      requirements: [
        '此处视频为氛围素材，请勿在素材中出现品牌标识，传达信息的文字、产品图片等',
        '视频规格需要提供一段9:16的纵向视频，高度需大于720px；视频帧数需在30FPS以上',
        '3-10秒的循环视频（最后一帧和第一帧需完全相同，或通过镜头切换来暗示循环效果）',
        'LOGO会由系统自动添加，无需在素材中呈现',
        '如有主体，需要放置在上1/2，否则会被界面元素遮盖'
      ],
      video: {
        duration: null,
        fps: null,
        audio: false
      }
    },
    image: null,
    mockupLayer: playerLayer,
    previewConfig: {
      bazelVisible: true,
      imageStyle: {
        width: '82.9%',
        height: '101.4%',
        objectFit: 'cover',
        transformOrigin: 'center',
        marginTop: '-1.2%',
        marginLeft: '8.5%',
        borderRadius: '8%'
      },
      middleLayer: {
        visible: true,
        zIndex: 2,
        style: {
          top: '-0.7%',
          left: '8.5%',
          width: '83%',
          height: '101.4%',
        },
        gradients: {
          bottom: {
            visible: true,
            style: {
              background: `linear-gradient(
                to bottom,
                rgba(0, 0, 0, 0) 0%,
                rgba(0, 0, 0, 0.11) 11.46%,
                rgba(0, 0, 0, 0.31) 24.48%,
                rgba(0, 0, 0, 0.48) 36.46%,
                rgba(0, 0, 0, 0.63) 48.35%,
                rgba(0, 0, 0, 0.74) 58.55%,
                rgba(0, 0, 0, 0.85) 71.53%,
                rgba(0, 0, 0, 0.95) 100%
              )`,
              top: '39%',
              height: '61%',
              position: 'absolute',
              left: '0',
              width: '100%'
            }
          },
          top: {
            visible: true,
            color: '#25b4e1',
            style: {
              top: '39%',
              height: '61%',
              opacity: 0.2,
              position: 'absolute',
              left: '0',
              width: '100%',
              background: `linear-gradient(
                to bottom,
                rgba(0, 0, 0, 0) 0%,
                rgba(0, 0, 0, 0.11) 11.46%,
                rgba(0, 0, 0, 0.31) 24.48%,
                rgba(0, 0, 0, 0.48) 36.46%,
                rgba(0, 0, 0, 0.63) 48.35%,
                rgba(0, 0, 0, 0.74) 58.55%,
                rgba(0, 0, 0, 0.85) 71.53%,
                rgba(0, 0, 0, 0.95) 100%
              )`
            }
          }
        }
      },
      uiLayer: {
        visible: true,
        zIndex: 3,
        style: {
          top: '-0.7%',
          left: '8.5%',
          width: '83%',
          height: '101.4%',
          objectFit: 'contain',
          borderRadius: '8%'
        }
      },
      configLabels: {
        colors: {
          title: '颜色设置',
          main: '主题色'
        },
        elements: {
          title: '播放信息',
          coverImage: '封面图',
          episodeTitle: '单集标题',
          podcastName: '播客名称',
          progressBar: '进度条'
        }
      },
      customElements: {
        coverImage: {
          image: null,
          visible: true,
          editable: true,
          style: {
            position: 'absolute',
            top: '45.5%',
            left: '2%',
            width: '123px',
            height: '123px',
            borderRadius: '23px',
            objectFit: 'cover',
            backgroundColor: '#25b4e1',
            overflow: 'hidden',
            boxShadow: '0px 5px 40px 0px rgba(0, 0, 0, 0.60)'
          }
        },
        episodeTitle: {
          text: '对话鲁豫：不仅热搜看不懂，连菜单也看不懂了',
          maxLength: 30,
          visible: true,
          editable: 'text-only',
          style: {
            position: 'absolute',
            top: '53.7%',
            left: '2%',
            color: '#ffffff',
            fontSize: '45px',
            fontWeight: '700',
            whiteSpace: 'pre-wrap',
            textAlign: 'left',
            width: '90%',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            lineHeight: '149%',
            WebkitLineClamp: 2,
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            userSelect: 'none'
          }
        },
        podcastName: {
          text: '这是播客节目名称',
          maxLength: 20,
          visible: true,
          editable: 'text-only',
          style: {
            position: 'absolute',
            bottom: '34.8%',
            left: '2.1%',
            color: '#25b4e1',
            fontSize: '40px',
            fontWeight: '600',
            whiteSpace: 'nowrap',
            textAlign: 'center',
            userSelect: 'none'
          }
        },
        progressBar: {
          image: `data:image/svg+xml;base64,${btoa(`<svg width="133" height="45" viewBox="0 0 133 45" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect y="37" width="5" height="8" rx="2.5" fill="#25b4e1"/>
            <rect x="8" y="29" width="5" height="16" rx="2.5" fill="#25b4e1"/>
            <rect x="16" y="30" width="5" height="15" rx="2.5" fill="#25b4e1"/>
            <rect x="24" y="26" width="5" height="19" rx="2.5" fill="#25b4e1"/>
            <rect x="32" y="18" width="5" height="27" rx="2.5" fill="#25b4e1"/>
            <rect x="40" y="17" width="5" height="28" rx="2.5" fill="#25b4e1"/>
            <rect x="48" y="29" width="5" height="16" rx="2.5" fill="#25b4e1"/>
            <rect x="56" y="31" width="5" height="14" rx="2.5" fill="#25b4e1"/>
            <rect x="64" y="29" width="5" height="16" rx="2.5" fill="#25b4e1"/>
            <rect x="72" y="29" width="5" height="16" rx="2.5" fill="#25b4e1"/>
            <rect x="80" y="28" width="5" height="17" rx="2.5" fill="#25b4e1"/>
            <rect x="88" y="30" width="5" height="15" rx="2.5" fill="#25b4e1"/>
            <rect x="96" y="29" width="5" height="16" rx="2.5" fill="#25b4e1"/>
            <rect x="104" y="23" width="5" height="22" rx="2.5" fill="#25b4e1"/>
            <rect x="112" y="14" width="5" height="31" rx="2.5" fill="#25b4e1"/>
            <rect x="120" y="4" width="5" height="41" rx="2.5" fill="#25b4e1"/>
            <rect x="128" width="5" height="45" rx="2.5" fill="#25b4e1"/>
          </svg>`)}`,
          visible: true,
          editable: false,
          style: {
            position: 'absolute',
            bottom: '22.1%',
            left: '-18.8%',
            width: '80%',
            height: '100px'
          }
        }
      }
    }
  },
  {
    id: 7,
    name: '发现页导航标签',
    size: '1152x2048',
    description: '在发现页顶部导航栏展示的品牌标签，点击可跳转到品牌播客主页',
    specs: {
      format: ['JPG', 'PNG'],
      maxSize: '2MB',
      requirements: [
        '图片尺寸需要严格按照规范制作，否则可能导致展示异常',
        '请勿自行增加按钮等点击引导的文案',
        '其余请遵循主视觉规范'
      ]
    },
    image: null,
    mockupLayer: barsLayer,
    previewConfig: {
      bazelVisible: true,
      imageStyle: {
        width: '81%',
        height: '95.1%',
        objectFit: 'cover',
        transformOrigin: 'center',
        marginTop: '4.4%',
        marginLeft: '9.4%',
        borderRadius: '10%'
      },
      uiLayer: {
        visible: true,
        zIndex: 3,
        style: {
          top: '2.5%',
          left: '11.1%',
          width: '78%',
          height: '95%',
          objectFit: 'contain'
        }
      },
      configLabels: {
        colors: {
          title: '颜色设置',
          themeColor: '主题色'
        },
        elements: {
          title: '封面配置',
          coverImage1: '背景图',
          coverImage2: '小图标',
          coverImage3: '右侧文字图'
        }
      },
      customElements: {
        staticImage1: {
          image: '/cata/1.png',
          visible: true,
          editable: false,
          style: {
            width: 'auto',
            objectFit: 'cover',
            overflow: 'hidden'
          }
        },
        staticImage2: {
          image: '/cata/2.png',
          visible: true,
          editable: false,
          style: {
            width: 'auto',
            objectFit: 'cover',
            overflow: 'hidden'
          }
        },
        staticImage3: {
          image: '/cata/3.png',
          visible: true,
          editable: false,
          style: {
            width: 'auto',
            objectFit: 'cover',
            overflow: 'hidden',
          }
        },
        staticImage4: {
          image: '/cata/4.png',
          visible: true,
          editable: false,
          style: {
            width: 'auto',
            objectFit: 'cover',
            overflow: 'hidden',
          }
        },
        coverImage1: {
          image: null,
          visible: true,
          editable: true,
          showImage: true,
          themeColor: '#25b4e1',
          style: {
            top: '45.5%',
            left: '2%',
            width: 'auto',
            height: 'auto',
            objectFit: 'cover',
            overflow: 'hidden',
            background: 'linear-gradient(180deg, rgba(37, 180, 225, 0.11) 0%, rgba(255, 255, 255, 0.5) 100%) white'
          }
        },
        coverImage2: {
          image: null,
          visible: true,
          editable: true,
          style: {
            top: '45.5%',
            left: '35%',
            width: 'auto',
            height: 'auto',
            objectFit: 'cover',
            overflow: 'hidden',
            zIndex: 99
          }
        },
        coverImage3: {
          image: null,
          visible: true,
          editable: true,
          text: '默认文字',
          maxLength: 10,
          showImage: false,
          zIndex: 99,
          style: {
            width: 'auto',
            height: '91%',
            objectFit: 'cover',
            overflow: 'hidden',
            transform: 'translateY(2px) translateX(-5px)',
            textStyle: {
              color: '#25b4e1',
              fontSize: '33px',
              textAlign: 'center',
              lineHeight: '123px',
              width: '100%',
              height: '100%',
            }
          }
        }
      }
    }
  }
] 
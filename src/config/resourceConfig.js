export const resourceTypes = [
  {
    id: 1,
    name: '开屏画报',
    size: '1152x2048',
    description: '开机3秒图片或者视频，触达全站听众，点击可跳转品牌播客主页',
    specs: {
      format: ['JPG', 'PNG', 'MP4', 'MOV'],
      maxSize: '20MB',
      requirements: [
        '安全区尺寸为903×1676px，此区域会完整展示在开屏中。如出现文字、LOGO请放置在安全区中',
        '跳转按钮的颜色和文字颜色可定义；请分别提供两个16进制与透明度的色值',
        '其余请遵循主视觉规范',
        '请勿自行增加按钮等点击引导的文案'
      ],
      video: {
        duration: null,
        fps: 30,
        audio: false
      }
    },
    image: null,
    mockupLayer: 'src/assets/mockups/splash_layer0.png',
    previewConfig: {
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
        zIndex: 2,
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
            whiteSpace: 'nowrap'
          }
        }
      }
    }
  },
  {
    id: 3,
    name: '定制单集',
    size: '1242x644',
    description: '应用场景：信息流中的图文广告，支持标题、描述文案和按钮的自定义，建议使用横向大图。',
    specs: {
      format: ['JPG', 'PNG'],
      maxSize: '2MB',
      requirements: [
        '建议使用横向大图',
        '保持图片主体内容清晰可见',
        '避免文字密集'
      ]
    },
    image: null,
    mockupLayer: 'src/assets/mockups/feed_layer0.png',
    previewConfig: {
      imageStyle: {
        width: '100%',
        height: '100%',
        objectFit: 'contain'
      },
      imagePosition: {
        top: '20%',
        left: '0',
        width: '100%',
        height: '60%'
      },
      uiLayer: {
        visible: true,
        zIndex: 2
      },
      customElements: {
        title: {
          text: '广告标题',
          maxLength: 12,
          visible: true,
          style: {
            color: '#333333',
            fontSize: '1.2em',
            fontWeight: 'bold',
            position: 'absolute',
            top: '5%',
            left: '5%',
            whiteSpace: 'nowrap'
          }
        },
        description: {
          text: '广告描述文案',
          maxLength: 20,
          visible: true,
          style: {
            color: '#666666',
            fontSize: '1em',
            position: 'absolute',
            top: '15%',
            left: '5%',
            maxWidth: '90%',
            lineHeight: '1.4'
          }
        },
        button: {
          text: '了解更多',
          maxLength: 4,
          visible: true,
          style: {
            backgroundColor: 'rgba(64, 169, 255, 0.9)',
            color: '#ffffff',
            borderRadius: '0.25em',
            padding: '0.5em 1em',
            position: 'absolute',
            bottom: '10%',
            right: '5%',
            fontSize: '0.9em',
            whiteSpace: 'nowrap'
          }
        }
      }
    }
  },
  {
    id: 4,
    name: 'Banner广告',
    size: '1242x200',
    description: '应用场景：页面顶部或底部的横幅广告，建议使用简洁的横向设计。',
    specs: {
      format: ['JPG', 'PNG'],
      maxSize: '2MB',
      requirements: [
        '建议使用横向设计',
        '保持重要内容在安全区域内',
        '避免过于复杂的背景',
        '文字内容清晰可见'
      ]
    },
    image: null,
    mockupLayer: 'src/assets/mockups/banner_layer0.png',
    previewConfig: {
      imageStyle: {
        width: '100%',
        height: '100%',
        objectFit: 'contain'
      },
      imagePosition: {
        top: '10%',
        left: '5%',
        width: '90%',
        height: '80%'
      },
      uiLayer: {
        visible: true,
        zIndex: 2
      }
    }
  }
] 
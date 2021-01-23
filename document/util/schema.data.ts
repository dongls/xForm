export default {
  labelSuffix: '：',
  labelPosition: 'left',
  fields: [
    {
      type: 'select',
      name: 'field_8e78d692',
      title: '型号',
      placeholder: '请先选择电脑型号',
      required: true,
      options: [
        {
          value: 'ThinkPad T480'
        },
        {
          value: 'ThinkPad T490'
        },
        {
          value: 'ThinkPad E590'
        },
        {
          value: 'ThinkPad X1'
        },
        {
          value: 'ThinkPad S3'
        },
        {
          value: '拯救者 Y9000K'
        },
        {
          value: '拯救者 Y7000'
        },
        {
          value: '小新 潮7000'
        },
        {
          value: '小新 14'
        }
      ],
      attributes: {
        multiple: false
      }
    },
    {
      type: 'text',
      name: 'field_da1a81',
      title: '序列号',
      placeholder: 'IMEI/MEID/SN',
      required: true,
      options: [],
      attributes: {}
    },
    {
      type: 'textarea',
      name: 'field_ee39cd',
      title: '故障描述',
      placeholder: '详细描述问题',
      defaultValue: '111',
      required: true,
      options: [],
      attributes: {}
    },
    {
      type: 'date',
      name: 'field_0330d113',
      title: '预约时间',
      placeholder: '服务人员会在预约时间上门处理',
      required: true,
      options: [],
      attributes: {
        type: 'datetime'
      }
    },
    {
      type: 'radio',
      name: 'field_33a15176',
      title: '保修状态',
      help: '- 保修期内(中国大陆正规渠道购买的产品在保修期内因为产品质量问题导致的故障，且无人为损坏)\n- 人为损坏(人为不当使用或未按说明书要求使用导致的损坏，如：屏幕有裂痕、接口断裂、外壳变形、进液损坏、ROOT、非厂商授权机构维修等)\n- 保质期外(产品已过保修期)',
      required: true,
      options: [
        {
          value: '保修期内'
        },
        {
          value: '人为损坏'
        },
        {
          value: '保修期外'
        }
      ],
      attributes: {
        style: 'inline',
        layout: 'inline'
      }
    },
    {
      type: 'checkbox',
      name: 'field_bf36e50c',
      title: '故障类型',
      placeholder: '',
      required: false,
      options: [
        {
          value: '无法开机'
        },
        {
          value: '蓝屏'
        },
        {
          value: '卡顿'
        },
        {
          value: '死机'
        },
        {
          value: '其他'
        }
      ],
      attributes: {
        layout: 'inline'
      }
    },
    {
      type: 'textarea',
      name: 'field_fec79373',
      title: '备注',
      placeholder: '如有其他需求，请在此填写',
      required: false,
      options: [],
      attributes: {}
    },
    {
      type: 'divider',
      name: 'field_ba61015f',
      title: '个人信息',
      required: false,
      options: [],
      attributes: {
        type: 'double',
        top: 50,
        bottom: 0
      }
    },
    {
      type: 'text',
      name: 'field_a874aae7',
      title: '姓名',
      placeholder: '请填写姓名，方便我们与您联系',
      required: true,
      options: [],
      attributes: {}
    },
    {
      type: 'text',
      name: 'field_fa4a9fde',
      title: '联系方式',
      placeholder: '电话号码、手机号、邮箱皆可',
      required: true,
      options: [],
      attributes: {}
    }
  ],
  viewerPlaceholder: '--'
}

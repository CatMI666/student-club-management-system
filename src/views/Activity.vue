<style lang="stylus" scoped>
.container
    display flex
    flex-direction column
    align-items center
    .header
        width 70%
        display flex
        flex-flow row nowrap
        align-items center
        justify-content space-between
        padding-bottom 16px
        border-bottom 2px solid #888
        .state
            display flex
            flex-flow row nowrap
            .activity-item
                margin 6px
                width 100px
                height 45px
                opacity 0.8
                line-height 45px
                color #fff
                border-radius 5px

    .content
        width 70%
</style>

<template lang="pug">
.container 
    .header
        .state
            .activity-item(v-for="item in state" :style="{backgroundColor:item.color}")
                span(style="font-size:16px;") {{item.title}}
                span(style="font-size:24px;font-weight:bolder;") {{item.value}}
        .opreation
            el-button(type="success" @click="$router.push('NewActivity')") 新建活动
    .content
        el-table(:data="activityData")
            el-table-column(prop="title" label="活动名" width="150")
            el-table-column(prop="introduce" label="介绍" align="center" )
            el-table-column(prop="state" label="状态" align="center" width="100")
                template(slot-scope="scope")
                    el-tag(:type="scope.row.stateType") {{scope.row.stateContent}}
            el-table-column(prop="date" label="日期" align="center" width="100")
            el-table-column(label="操作" align="center" width="150")
                template(slot-scope="scope")
                    el-button(type="text" @click="$router.push(`ActivityDetail/${scope.row.id}`)") 详情
                    el-button(type="text" @click="showSetState(scope.row.id, scope.$index)" :disabled="scope.row.state === 0 ? true : false") 设置状态
    el-dialog(title="设置状态" :visible.sync="stateDialogVisable")
        el-steps(:active="changedState.value" finish-status="success" simple)
            el-step(title="筹备中" icon="el-icon-tickets")
            el-step(title="进行中" icon="el-icon-phone-outline")
            el-step(title="已完成" icon="el-icon-view")
        el-button(style="margin-top:16px" type="primary" @click="changeNextState") 下一阶段！
</template>

<script>
export default {
    name: 'Activity',
    data: () => ({
        state: [
            {
                title: '审批中 ',
                value: '--',
                color: '#e6a23c'
            },
            {
                title: '筹备中 ',
                value: '--',
                color: '#67c23a'
            },
            {
                title: '进行中 ',
                value: '--',
                color: '#409EFF'
            },
            {
                title: '已完成 ',
                value: '--',
                color: '#909399'
            }
        ],
        activityData: [],
        stateDialogVisable: false,
        // 存放正在修改的活动状态
        changedState: {
            id: null,
            index: null,
            value: null
        }
    }),
    methods: {
        showSetState(activityId, activityIndex) {
            this.stateDialogVisable = !this.stateDialogVisable
            this.changedState.id = activityId
            this.changedState.index = activityIndex
            
            this.$set(this.changedState, 'value', this.activityData[activityIndex].state)
            // this.changedState.value = this.state[activityId].value
        },
        changeNextState() {
            this.$confirm('确认修改状态？').then(() => {
                this.submitState()
            })
        },
        submitState() {
            console.log(this.changedState)
            if (this.changedState.value <= 2) {
                this.stateDialogVisable = false

                this.$post('/v1/activity/setActivityNextState', {
                    activityId: this.changedState.id
                }).then(resp => {
                    if (resp.data.state) {
                        this.fetch()
                    }

                    this.$message({
                        type: resp.data.state ? 'success' : 'error',
                        message: resp.data.msg,
                        showClose: true
                    })
                })
            }
            else {
                this.stateDialogVisable = false

                this.$message.info('该活动已经是最终状态啦')
            }
        },
        fetch() {
            this.$get('/v1/club/getAcitvityById', {
                    clubId: this.session.permission.clubId
            }).then(resp => {
                this.activityData = resp.data.map(item => {
                    console.log(resp)
                    item.stateContent = this.config.activityState[item.state].content
                    item.stateType = this.config.activityState[item.state].type
                    return item
                })
            })
            this.$get('/v1/club/getAcitvityInfoById', {
                    clubId: this.session.permission.clubId
            }).then(resp => {
                resp.data.map((item, index) => {
                    this.state[index].value = item
                })
            })
        }
    },
    mounted() {
        this.fetch()
    }
}
</script>

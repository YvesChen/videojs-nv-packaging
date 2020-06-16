<template>
    <div id="app">
        <div class="moor-item">
            <label>Switch: </label>

            <moor-switch
                    v-model="lightSwitch">开关(开):
            </moor-switch>

            <moor-switch
                    v-model="switchLight">开关(关):
            </moor-switch>

            <player :url="`http://cdn.chaofan.com/video/2020/06/03/ltyn4XZTdNUBuinFLcpYoZYhSXvJ&controlbar=auto`"></player>
        </div>

    </div>
</template>

<script>
    export default {
        name: 'app',
        data() {
            console.log("BBBBBBBBB",this.$route)
            return {
                // HelloWorld
                msg: 'Welcome to moor UI!',
                color: 'red',
                // Select
                selectValue: '',
                options: [
                    {
                        value: '选项1',
                        label: '黄金糕'
                    }, {
                        value: '选项2',
                        label: '双皮奶'
                    }, {
                        value: '选项3',
                        label: '蚵仔煎'
                    }, {
                        value: '选项4',
                        label: '龙须面'
                    }
                ],
                // input
                input1: '',
                input2: '这是默认值',
                inputDisabled: true,
                // switch
                lightSwitch: false,
                switchLight: true
            }
        },
        methods: {
            onClick: function (e) {
                console.log('click', e);
            },
            handlePrint() {
                console.log('selectValue', this.selectValue);
                console.log('input1:', this.input1);
                console.log('input2:', this.input2);
            }
        },
        watch: {
            lightSwitch: newValue => console.log('开关：', newValue),
        }
    }
</script>

<style lang="scss">
    .moor-select, .moor-btn, .moor-switch, .moor-input {
        margin: 10px 6px;
    }

    .moor-item {
        display: flex;
        align-items: center;

        label {
            width: 100px;
            display: inline-block;
        }
    }
</style>

<template>
	<section>
      <el-input
        placeholder="输入关键字进行过滤"
        v-model="filterText">
      </el-input>
      <el-tree
        class="filter-tree"
        :data="subjects"
        :props="defaultProps"
        :filter-node-method="filterNode"
        @node-click="selectSubject"
        ref="tree2">
      </el-tree>    
	</section>
</template>
<script type="text/javascript">
import { getSubjectsTree } from '../../api/index'
export default {
  props: {
    curtainId: {
      type: Number
    },
    filterCode: {
      type: String
    },
    rootSelect: {
      type: Boolean
    }
  },
  watch: {
    filterCode () {
      this.filterText = this.filterCode
    },
    filterText (val) {
      this.$refs.tree2.filter(val)
    }
  },
  methods: {
    filterNode (value, data) {
      if (!value) return true
      let reg = new RegExp('^' + value)
      return reg.test(data.code)
    },
    getSubjects () {
      let para = {
        'curtainId': this.curtainId
      }
      getSubjectsTree(para).then((res) => {
        this.subjects = res.data
        this.$nextTick(() => { // 等数据装载完成后执行过滤
          this.$refs.tree2.filter(this.filterText)
        })
      })
    },
    selectSubject (data) {
      if ((this.rootSelect && data.id) || data.children.length === 0) {
        let fullName = data.fullName ? data.fullName : data.label
        this.$emit('selectedSubject', {
          id: data.id,
          name: fullName
        })
      }
    }
  },
  data () {
    return {
      filterText: '',
      subjects: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  mounted () {
    this.filterText = this.filterCode
    this.getSubjects()
  }
}
</script>
<style lang="stylus">
</style>

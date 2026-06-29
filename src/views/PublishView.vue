<template>
  <section class="page">
    <div class="page-header">
      <h1>发布信息</h1>
      <p>选择分类，填写信息，发布到校园轻集市。</p>
    </div>

    <div class="publish-card">
      <el-tabs v-model="activeTab" type="border-card">
        <!-- 二手交易 -->
        <el-tab-pane label="🛒 二手交易" name="trade">
          <el-form :model="form.trade" label-position="top" size="large">
            <el-row :gutter="16">
              <el-col :span="16">
                <el-form-item label="商品标题">
                  <el-input v-model="form.trade.title" placeholder="例如：九成新机械键盘 Cherry青轴" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="分类">
                  <el-select v-model="form.trade.category" placeholder="选择分类" style="width: 100%">
                    <el-option label="数码配件" value="数码配件" />
                    <el-option label="教材资料" value="教材资料" />
                    <el-option label="生活用品" value="生活用品" />
                    <el-option label="运动户外" value="运动户外" />
                    <el-option label="出行交通" value="出行交通" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="16">
              <el-col :span="12">
                <el-form-item label="价格（元）">
                  <el-input-number v-model="form.trade.price" :min="0" :precision="0" style="width: 100%" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="成色">
                  <el-select v-model="form.trade.condition" placeholder="选择成色" style="width: 100%">
                    <el-option label="全新" value="全新" />
                    <el-option label="九五成新" value="九五成新" />
                    <el-option label="九成新" value="九成新" />
                    <el-option label="八成新" value="八成新" />
                    <el-option label="七成新" value="七成新" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="交易地点">
              <el-input v-model="form.trade.location" placeholder="例如：东区宿舍" />
            </el-form-item>
            <el-form-item label="商品描述">
              <el-input v-model="form.trade.description" type="textarea" :rows="3" placeholder="描述商品的使用情况、配件等信息..." />
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <!-- 失物招领 -->
        <el-tab-pane label="🔍 失物招领" name="lostFound">
          <el-form :model="form.lostFound" label-position="top" size="large">
            <el-row :gutter="16">
              <el-col :span="8">
                <el-form-item label="类型">
                  <el-radio-group v-model="form.lostFound.type">
                    <el-radio-button value="lost">寻物启事</el-radio-button>
                    <el-radio-button value="found">失物招领</el-radio-button>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="16">
                <el-form-item label="物品名称">
                  <el-input v-model="form.lostFound.itemName" placeholder="例如：校园卡、雨伞、计算器" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="标题">
              <el-input v-model="form.lostFound.title" placeholder="例如：寻找黑色校园卡" />
            </el-form-item>
            <el-form-item label="地点">
              <el-input v-model="form.lostFound.location" placeholder="例如：一食堂附近" />
            </el-form-item>
            <el-form-item label="描述">
              <el-input v-model="form.lostFound.description" type="textarea" :rows="3" placeholder="描述物品特征、丢失/拾取的具体情况..." />
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <!-- 拼单搭子 -->
        <el-tab-pane label="👥 拼单搭子" name="groupBuy">
          <el-form :model="form.groupBuy" label-position="top" size="large">
            <el-row :gutter="16">
              <el-col :span="16">
                <el-form-item label="拼单标题">
                  <el-input v-model="form.groupBuy.title" placeholder="例如：周五晚火锅拼单" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="拼单类型">
                  <el-select v-model="form.groupBuy.type" placeholder="选择类型" style="width: 100%">
                    <el-option label="拼餐" value="拼餐" />
                    <el-option label="学习资料" value="学习资料" />
                    <el-option label="出行拼车" value="出行拼车" />
                    <el-option label="生鲜水果" value="生鲜水果" />
                    <el-option label="生活服务" value="生活服务" />
                    <el-option label="运动健身" value="运动健身" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="16">
              <el-col :span="12">
                <el-form-item label="目标人数">
                  <el-input-number v-model="form.groupBuy.targetCount" :min="2" :max="50" style="width: 100%" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="截止时间">
                  <el-input v-model="form.groupBuy.deadline" placeholder="例如：2026-06-30 17:00" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="地点">
              <el-input v-model="form.groupBuy.location" placeholder="例如：学校南门海底捞" />
            </el-form-item>
            <el-form-item label="描述">
              <el-input v-model="form.groupBuy.description" type="textarea" :rows="3" placeholder="描述拼单详情、费用分摊方式..." />
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <!-- 跑腿委托 -->
        <el-tab-pane label="🏃 跑腿委托" name="errand">
          <el-form :model="form.errand" label-position="top" size="large">
            <el-row :gutter="16">
              <el-col :span="16">
                <el-form-item label="任务标题">
                  <el-input v-model="form.errand.title" placeholder="例如：帮取快递到宿舍楼下" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="任务类型">
                  <el-select v-model="form.errand.taskType" placeholder="选择类型" style="width: 100%">
                    <el-option label="取快递" value="取快递" />
                    <el-option label="代买" value="代买" />
                    <el-option label="搬运" value="搬运" />
                    <el-option label="代办" value="代办" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="16">
              <el-col :span="8">
                <el-form-item label="酬劳（元）">
                  <el-input-number v-model="form.errand.reward" :min="0" :precision="0" style="width: 100%" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="取件地">
                  <el-input v-model="form.errand.from" placeholder="例如：菜鸟驿站" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="送达地">
                  <el-input v-model="form.errand.to" placeholder="例如：西区5栋" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="截止时间">
              <el-input v-model="form.errand.deadline" placeholder="例如：2026-06-29 19:00" />
            </el-form-item>
            <el-form-item label="描述">
              <el-input v-model="form.errand.description" type="textarea" :rows="3" placeholder="描述任务细节、快递大小、特殊要求..." />
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>

      <div class="publish-actions">
        <el-button size="large" @click="handleCancel">取消</el-button>
        <el-button type="primary" size="large" @click="handlePublish" :icon="'Plus'">
          发布信息
        </el-button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

const activeTab = ref('trade')

const form = reactive({
  trade: {
    title: '',
    category: '',
    price: 0,
    condition: '',
    location: '',
    description: '',
  },
  lostFound: {
    title: '',
    type: 'lost',
    itemName: '',
    location: '',
    description: '',
  },
  groupBuy: {
    title: '',
    type: '',
    targetCount: 2,
    deadline: '',
    location: '',
    description: '',
  },
  errand: {
    title: '',
    taskType: '',
    reward: 0,
    from: '',
    to: '',
    deadline: '',
    description: '',
  },
})

function handlePublish() {
  const tabLabels: Record<string, string> = {
    trade: '二手交易',
    lostFound: '失物招领',
    groupBuy: '拼单搭子',
    errand: '跑腿委托',
  }
  ElMessage.success(`${tabLabels[activeTab.value]}信息发布成功！（模拟）`)
}

function handleCancel() {
  ElMessage.info('已取消发布')
}
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.page-header {
  padding: 24px;
  border-radius: var(--radius-lg);
  background: var(--color-card);
  box-shadow: var(--shadow-sm);
}

.page-header h1 {
  margin: 0 0 8px;
  font-size: 22px;
  color: var(--color-text);
}

.page-header p {
  margin: 0;
  color: var(--color-text-secondary);
}

.publish-card {
  background: var(--color-card);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}

.publish-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px 24px;
  border-top: 1px solid var(--color-border-light);
}
</style>

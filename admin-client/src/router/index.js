import Vue from 'vue'
import Router from 'vue-router'

import LoginPage from '@/components/LoginPage'
import DashboardPage from '@/components/DashboardPage'
import WelcomePage from '@/components/WelcomePage'

import GoodsPage from '@/components/Goods/GoodsPage'
import GoodsAddPage from '@/components/Goods/GoodsAddPage'

import CategoryPage from '@/components/Category/CategoryPage'
import CategoryAddPage from '@/components/Category/CategoryAddPage'

import BrandPage from '@/components/Brand/BrandPage'
import BrandAddPage from '@/components/Brand/BrandAddPage'

import OrderPage from '@/components/Order/OrderPage'
import OrderDetailPage from '@/components/Order/OrderDetailPage'

import TopicPage from '@/components/Topic/TopicPage'
import TopicAddPage from '@/components/Topic/TopicAddPage'

import UserPage from '@/components/User/UserPage'
import UserAddPage from '@/components/User/UserAddPage'

Vue.use(Router)

export default new Router({
    scrollBehavior: () => ({
        y: 0
    }),
    routes: [{
        path: '/',
        name: 'dashboard',
        redirect: '/dashboard'
    }, {
        path: '/dashboard',
        component: DashboardPage,
        children: [{
            path: '/',
            name: 'welcome',
            component: WelcomePage
        }, {
            path: 'goods',
            name: 'goods',
            component: GoodsPage
        }, {
            path: 'goods/add',
            name: 'goods_add',
            component: GoodsAddPage
        }, {
            path: 'category',
            name: 'category',
            component: CategoryPage
        }, {
            path: 'category/add',
            name: 'category_add',
            component: CategoryAddPage
        }, {
            path: 'brand',
            name: 'brand',
            component: BrandPage
        }, {
            path: 'brand/add',
            name: 'brand_add',
            component: BrandAddPage
        }, {
            path: 'order',
            name: 'order',
            component: OrderPage
        }, {
            path: 'order/detail',
            name: 'order_detail',
            component: OrderDetailPage
        }, {
            path: 'operate/topic',
            name: 'topic',
            component: TopicPage
        }, {
            path: 'operate/topic/add',
            name: 'topic_add',
            component: TopicAddPage
        }, {
            path: 'user',
            name: 'user',
            component: UserPage
        }, {
            path: 'user/add',
            name: 'user_add',
            component: UserAddPage
        }, ]
    }, {
        path: '/login',
        name: 'login',
        component: LoginPage
    }, {
        path: '*',
        redirect: '/dashboard'
    }]
})
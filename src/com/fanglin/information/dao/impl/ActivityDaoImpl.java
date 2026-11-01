/**
 * @File Name	: ActivityDaoImpl.java
 * @Package   	: com.fanglin.information.dao.impl
 * @Version		: 1.0
 * @Date			: 2015-11-2
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email		: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.information.dao.impl;

import java.math.BigInteger;
import java.sql.Timestamp;
import java.util.Arrays;
import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.information.dao.ActivityDao;
import com.fanglin.information.po.ActivityPO;
import com.fanglin.utils.Paging;

@Repository("activityDao")
public class ActivityDaoImpl extends DaoImpl<ActivityPO> implements ActivityDao {

	public ActivityDaoImpl() {
		super(ActivityPO.class);
	}

	@Override
	public List<ActivityPO> pageActivity(Paging paging, List<Filter> filters, int company) {

		PagingQuery<ActivityPO> query = pagingQuery(paging, ActivityPO.class);

		query.add(Restrictions.in("status", Arrays.asList(ActivityPO.STATUS_VALID_INT, ActivityPO.STATUS_UNVALID_INT)));
		query.add(Restrictions.eq("company", company));

		queryFilterExcute(query, filters);

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<ActivityPO> queryActivityForValid(int company, short type) {
		return session().createCriteria(ActivityPO.class).add(Restrictions.eq("company", company)).add(Restrictions.eq(ActivityPO.COLUMN_STATUS_STR, ActivityPO.STATUS_VALID_INT)).add(Restrictions.eq(ActivityPO.COLUMN_TYPE_STR, type)).list();
	}

	@Override
	public ActivityPO queryActivityForDefault(int company, short type) {
		return (ActivityPO) session().createCriteria(ActivityPO.class).add(Restrictions.eq("company", company)).add(Restrictions.eq(ActivityPO.COLUMN_DEFAULTS_STR, ActivityPO.DEFAULTS_DEFAULT_INT)).add(Restrictions.eq(ActivityPO.COLUMN_STATUS_STR, ActivityPO.STATUS_VALID_INT)).add(Restrictions.eq(ActivityPO.COLUMN_TYPE_STR, type)).setMaxResults(1).uniqueResult();
	}

	@Override
	public ActivityPO queryActivityForLottery(int company, Timestamp now) {
<<<<<<< HEAD
		return (ActivityPO) session().createCriteria(ActivityPO.class).add(Restrictions.eq("company", company)).add(Restrictions.eq("rewardType", ActivityPO.REWARDTYPE_LOTTERY_INT)).add(Restrictions.eq(ActivityPO.COLUMN_STATUS_STR, ActivityPO.STATUS_VALID_INT)).add(Restrictions.or(Restrictions.isNull("startTime"), Restrictions.le("startTime", now))).add(Restrictions.or(Restrictions.isNull("endTime"), Restrictions.ge("endTime", now))).setMaxResults(1).uniqueResult();
=======
		return (ActivityPO) session().createCriteria(ActivityPO.class).add(Restrictions.eq("company", company)).add(Restrictions.eq(ActivityPO.COLUMN_TYPE_STR, ActivityPO.TYPE_LOTTERY_INT)).add(Restrictions.eq(ActivityPO.COLUMN_STATUS_STR, ActivityPO.STATUS_VALID_INT))
				.add(Restrictions.or(Restrictions.isNull("startTime"), Restrictions.le("startTime", now)))
				.add(Restrictions.or(Restrictions.isNull("endTime"), Restrictions.ge("endTime", now)))
				.setMaxResults(1).uniqueResult();
>>>>>>> 8da6de2f2 (refactor(decoration): 抽奖券引擎归位DecorationActivityItemService终版+type=20复用+state=11抽奖语义+SQL优先统计+活动物品查询页——本轮全量对齐拍板: ①type=20复用(弃rewardType列, ActivityPO删字段加TYPE_LOTTERY_INT=20, 前端活动列表硬编码type=1零影响, dev/test已建rewardType列已DROP) ②awardName列方案废弃改state常量STATUS_DRAW_INT=11抽奖(语义=参与抽奖非中奖结果, 奖项详情由抽奖系统说明; 生命周期0初始→11抽奖→10已领; key=10显示'已领'有意为之需求方无核销概念勿改'核销'; 引擎回收纯state=0筛选已参与抽奖绝不回收; PO/VO删awardName字段) ③唯一性闸count化(ActivityDao.countActivityForLottery原生SQL select count(*)条件company+type20+status有效+aid≠自身+双null窗口重叠兜底, 自身null归一1970/2999极值) ④引擎归位DecorationActivityItemService(issueDecorationActivityItemByOrderId插桩/issueDecorationActivityItem全量补发.do, 私有方法全内联, information侧回退activity域本职仅剩唯一性闸) ⑤SQL优先统计(AGENTS.md新规范'统计查询SQL优先'沉淀: 判断总数类count/汇总类sum/Service只拿数值结果/豁免=带轨迹写循环+业务规则计算+业务编排循环; 引擎三处统计for改造: 净额→PaymentDao.amountPayment窗口重载SUM CASE WHEN/已发券→countDecorationActivityItemForLottery/活动定位→queryActivityForLottery窗口条件下沉DAO单条返回) ⑥活动物品查询页(缺口②全国门店员工查中奖客户入口): DecorationActivityItemDao.pageDecorationActivityItem+queryFilterExcute白名单七条件(orderId/no/activityName/activityItemName/type/state/atttype)+Service/Action(pageDecorationActivityItem.do)+api+condition七条件组(select型dataSource内嵌数组绕开constant缺组)+views/decoration/decoration4activityItem.html+js(Searcher样板, state=11红色高亮)+菜单SQL(menu_decoration4activityItem: 生产mid=940挂mid=39下, dev实际956/test-erp实际945按各环境MAX(mid)占用调整) ⑦SQL清单3文件生产执行序: sqls/information/40建表(唯一DDL)+sqls/decoration/menu_decoration4activityItem菜单+sqls/communion/25字典(state=11抽奖+核销10value归位已领为有意为之勿改)——①③dev/test-erp双库已执行, 初始化SQL 41号全国版(awardstock 1条+67公司activity(type=20,窗口2026-11-01~12-31)+activityrule 2行/公司, 门槛厘: 方林屿林3000万/恩林爱林2000万/1918别墅6000万, 生产67家dev 35家)+菜单按环境已执行; 方案文档同步刷新终态(无rewardType/awardName残留); 三jar重打未部署(decoration 331471B/information 194016B/payment 322045B); 待办=dev/test部署后跑验证脚本+生产操作单)
	}

	@Override
	public int countActivityForLottery(int company, Timestamp startTime, Timestamp endTime, long excludeAid) {

		String sql = "select count(*) from information.activity where company = :company and rewardType = :rewardType and status = :status and aid != :excludeAid and (startTime is null or startTime < :endTime) and (endTime is null or endTime > :startTime)";

		BigInteger count = (BigInteger) session().createSQLQuery(sql).setInteger("company", company).setShort("rewardType", ActivityPO.REWARDTYPE_LOTTERY_INT).setShort("status", ActivityPO.STATUS_VALID_INT).setLong("excludeAid", excludeAid).setTimestamp("startTime", startTime).setTimestamp("endTime", endTime).uniqueResult();

		return count.intValue();
	}

	@Override
	public int resetActivityForDefault(short type, int company) {

		String sql = "update information.activity set defaults = :defaults where type = :type and company = :company";
		session().createSQLQuery(sql).setShort("defaults", ActivityPO.DEFAULTS_COMMON_INT).setShort("type", type).setInteger("company", company).executeUpdate();

		return 0;
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		query.alias("creater", "creater");

		if (filters == null) return;

		for (Filter filter : filters) {

			if (ActivityPO.COLUMN_STATUS_STR.equals(filter.getField())) {
				query.add(query.getCriterion(filter.getField(), Short.valueOf(filter.getData()), filter.getOp()));
			} else if (ActivityPO.COLUMN_TYPE_STR.equals(filter.getField())) {
				query.add(query.getCriterion(filter.getField(), Short.valueOf(filter.getData()), filter.getOp()));
			} else {
				query.add(query.getCriterion(filter.getField(), filter.getData(), filter.getOp()));
			}
		}

	}

<<<<<<< HEAD
=======

	@Override
	public int countActivityForLottery(int company, Timestamp startTime, Timestamp endTime, long excludeAid) {

		String sql = "select count(*) from information.activity where company = :company and type = :type and status = :status and aid != :excludeAid and (startTime is null or startTime < :endTime) and (endTime is null or endTime > :startTime)";

		BigInteger count = (BigInteger) session().createSQLQuery(sql)
				.setInteger("company", company)
				.setShort("type", ActivityPO.TYPE_LOTTERY_INT)
				.setShort("status", ActivityPO.STATUS_VALID_INT)
				.setLong("excludeAid", excludeAid)
				.setTimestamp("startTime", startTime)
				.setTimestamp("endTime", endTime)
				.uniqueResult();

		return count.intValue();
	}
>>>>>>> 8da6de2f2 (refactor(decoration): 抽奖券引擎归位DecorationActivityItemService终版+type=20复用+state=11抽奖语义+SQL优先统计+活动物品查询页——本轮全量对齐拍板: ①type=20复用(弃rewardType列, ActivityPO删字段加TYPE_LOTTERY_INT=20, 前端活动列表硬编码type=1零影响, dev/test已建rewardType列已DROP) ②awardName列方案废弃改state常量STATUS_DRAW_INT=11抽奖(语义=参与抽奖非中奖结果, 奖项详情由抽奖系统说明; 生命周期0初始→11抽奖→10已领; key=10显示'已领'有意为之需求方无核销概念勿改'核销'; 引擎回收纯state=0筛选已参与抽奖绝不回收; PO/VO删awardName字段) ③唯一性闸count化(ActivityDao.countActivityForLottery原生SQL select count(*)条件company+type20+status有效+aid≠自身+双null窗口重叠兜底, 自身null归一1970/2999极值) ④引擎归位DecorationActivityItemService(issueDecorationActivityItemByOrderId插桩/issueDecorationActivityItem全量补发.do, 私有方法全内联, information侧回退activity域本职仅剩唯一性闸) ⑤SQL优先统计(AGENTS.md新规范'统计查询SQL优先'沉淀: 判断总数类count/汇总类sum/Service只拿数值结果/豁免=带轨迹写循环+业务规则计算+业务编排循环; 引擎三处统计for改造: 净额→PaymentDao.amountPayment窗口重载SUM CASE WHEN/已发券→countDecorationActivityItemForLottery/活动定位→queryActivityForLottery窗口条件下沉DAO单条返回) ⑥活动物品查询页(缺口②全国门店员工查中奖客户入口): DecorationActivityItemDao.pageDecorationActivityItem+queryFilterExcute白名单七条件(orderId/no/activityName/activityItemName/type/state/atttype)+Service/Action(pageDecorationActivityItem.do)+api+condition七条件组(select型dataSource内嵌数组绕开constant缺组)+views/decoration/decoration4activityItem.html+js(Searcher样板, state=11红色高亮)+菜单SQL(menu_decoration4activityItem: 生产mid=940挂mid=39下, dev实际956/test-erp实际945按各环境MAX(mid)占用调整) ⑦SQL清单3文件生产执行序: sqls/information/40建表(唯一DDL)+sqls/decoration/menu_decoration4activityItem菜单+sqls/communion/25字典(state=11抽奖+核销10value归位已领为有意为之勿改)——①③dev/test-erp双库已执行, 初始化SQL 41号全国版(awardstock 1条+67公司activity(type=20,窗口2026-11-01~12-31)+activityrule 2行/公司, 门槛厘: 方林屿林3000万/恩林爱林2000万/1918别墅6000万, 生产67家dev 35家)+菜单按环境已执行; 方案文档同步刷新终态(无rewardType/awardName残留); 三jar重打未部署(decoration 331471B/information 194016B/payment 322045B); 待办=dev/test部署后跑验证脚本+生产操作单)
}

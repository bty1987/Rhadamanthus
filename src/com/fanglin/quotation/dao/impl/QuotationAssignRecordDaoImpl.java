/**
 * @File Name     : QuotationAssignRecordDaoImpl.java
 * @Package      : com.fanglin.quotation.dao.impl
 * @Version       : 1.0
 * @Date          : 2026-03-20
 * @Copyright     : Copyright Creators 2026
 * @Author        : Claude AI
 * @Describing    : 装修单预算分配记录表 DAO 实现类
 */

package com.fanglin.quotation.dao.impl;

import java.util.List;

import org.hibernate.criterion.Projections;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.quotation.dao.QuotationAssignRecordDao;
import com.fanglin.quotation.po.QuotationAssignRecordPO;
import com.fanglin.utils.Paging;

/**
 * 装修单预算分配记录表 DAO 实现类
 * 
 * @author Claude AI
 * @date 2026-03-20
 */
@Repository("quotationAssignRecordDao")
public class QuotationAssignRecordDaoImpl extends DaoImpl<QuotationAssignRecordPO> implements QuotationAssignRecordDao {

	/**
	 * 构造函数
	 */
	public QuotationAssignRecordDaoImpl() {
		super(QuotationAssignRecordPO.class);
	}

	@Override
	public List<QuotationAssignRecordPO> pageQuotationAssignRecord(Paging paging, List<Filter> filters, Integer company) {

		PagingQuery<QuotationAssignRecordPO> query = pagingQuery(paging, QuotationAssignRecordPO.class);

		// 处理动态过滤条件
		queryFilterExcute(query, filters);

		// 按分配时间倒序排序
		query.desc("assignTime");

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<QuotationAssignRecordPO> queryQuotationAssignRecordByOrderId(String orderId) {
		return createCriteria(QuotationAssignRecordPO.class).add(Restrictions.eq("orderId", orderId)).addOrder(org.hibernate.criterion.Order.desc("assignTime")).list();
	}

	@Override
	public int countQuotationAssignRecordByUid(int uid) {

		Number count = (Number) createCriteria(QuotationAssignRecordPO.class).add(Restrictions.eq("uid", uid)).add(Restrictions.eq("assignResult", QuotationAssignRecordPO.ASSIGN_RESULT_SUCCESS_INT)).setProjection(Projections.rowCount()).uniqueResult();

		return count != null ? count.intValue() : 0;
	}

	/**
	 * 执行过滤条件
	 * 
	 * @param query 分页查询对象
	 * @param filters 过滤条件列表
	 */
	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		if (filters == null) return;

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if ("orderId".equals(field)) {
				// 装修单号：模糊匹配
				query.add(query.getCriterion("orderId", data, op));
			} else if ("assignResult".equals(field)) {
				// 分配结果：精确匹配
				query.add(query.getCriterion("assignResult", Byte.valueOf(data), op));
			} else if ("assignType".equals(field)) {
				// 分配类型：精确匹配
				query.add(query.getCriterion("assignType", Short.valueOf(data), op));
			} else if ("uid".equals(field)) {
				// 预算员用户ID：精确匹配
				query.add(query.getCriterion("uid", Integer.valueOf(data), op));
			}
		}
	}

}

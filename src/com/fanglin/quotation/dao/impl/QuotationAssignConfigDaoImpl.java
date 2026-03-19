/**
 * @File Name		: QuotationAssignConfigDaoImpl.java
 * @Package  	: com.fanglin.quotation.dao.impl
 * @Version		: 1.0
 * @Date			: 2026-03-19
 * @Copyright	: Copyright Creators 2026
 * @Author		: bty1987
 * @Email			: bty1987@163.com
 * @Describing	: 预算配置表 DAO 实现类
 */

package com.fanglin.quotation.dao.impl;

import java.util.List;

import org.hibernate.criterion.Order;
import org.hibernate.criterion.Projections;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.quotation.dao.QuotationAssignConfigDao;
import com.fanglin.quotation.po.QuotationAssignConfigPO;
import com.fanglin.utils.Paging;

/**
 * 预算配置表 DAO 实现类
 * 
 * <p>
 * 职责：实现预算配置的数据库访问操作
 * </p>
 * 
 * @author bty1987
 * @version 1.0
 */
@Repository("quotationAssignConfigDao")
public class QuotationAssignConfigDaoImpl extends DaoImpl<QuotationAssignConfigPO> implements QuotationAssignConfigDao {

	/**
	 * 构造函数
	 */
	public QuotationAssignConfigDaoImpl() {
		super(QuotationAssignConfigPO.class);
	}

	@Override
	public List<QuotationAssignConfigPO> pageQuotationAssignConfig(Paging paging, List<Filter> filters, Integer company) {

		PagingQuery<QuotationAssignConfigPO> query = pagingQuery(paging, QuotationAssignConfigPO.class);

		// 按公司筛选
		if (company != null) {
			query.add(query.getCriterion("company", company, "eq"));
		}

		// 按创建时间倒序排序
		query.desc("createTime");

		return query.list();
	}

	@Override
	public QuotationAssignConfigPO queryQuotationAssignConfig(int company, Integer department) {
		return (QuotationAssignConfigPO) createCriteria(QuotationAssignConfigPO.class).add(Restrictions.eq("company", company)).add(Restrictions.eq("department", department)).uniqueResult();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<QuotationAssignConfigPO> queryQuotationAssignConfig(int company) {
		return createCriteria(QuotationAssignConfigPO.class).add(Restrictions.eq("company", company)).addOrder(Order.asc("department")).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<QuotationAssignConfigPO> queryQuotationAssignConfig(int company, Integer department, short status) {
		return createCriteria(QuotationAssignConfigPO.class).add(Restrictions.eq("company", company)).add(Restrictions.eq("enabled", status)).add(Restrictions.or(Restrictions.eq("department", department), Restrictions.isNull("department"))).addOrder(Order.asc("department")).list();
	}

	@Override
	public boolean queryQuotationAssignConfigForEnable(int company) {

		Number count = (Number) createCriteria(QuotationAssignConfigPO.class).add(Restrictions.eq("company", company)).add(Restrictions.eq("enabled", QuotationAssignConfigPO.ENABLED_ENABLED_INT)).add(Restrictions.eq("autoAssign", QuotationAssignConfigPO.AUTO_ASSIGN_AUTO_INT)).setProjection(Projections.rowCount()).uniqueResult();

		return count != null && count.intValue() > 0;
	}
}

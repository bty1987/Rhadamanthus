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
			query.add(query.alias("company", "company").getCriterion("company.cid", company, "eq"));
		}

		// 处理动态过滤条件
		queryFilterExcute(query, filters);

		// 按创建时间倒序排序
		query.desc("createTime");

		return query.list();
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

			if ("enabled".equals(field)) {
				// 是否启用：精确匹配
				query.add(query.getCriterion("enabled", Short.valueOf(data), op));
			} else if ("company".equals(field)) {
				// 公司：已在方法参数中处理，这里跳过
				continue;
			}
		}
	}

	@Override
	public QuotationAssignConfigPO queryQuotationAssignConfig(int company, Integer department) {
		return (QuotationAssignConfigPO) createCriteria(QuotationAssignConfigPO.class).add(Restrictions.eq("company.cid", company)).add(Restrictions.eq("department", department)).uniqueResult();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<QuotationAssignConfigPO> queryQuotationAssignConfig(int company) {
		return createCriteria(QuotationAssignConfigPO.class).add(Restrictions.eq("company.cid", company)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<QuotationAssignConfigPO> queryQuotationAssignConfig(int company, Integer department, short status) {
		return createCriteria(QuotationAssignConfigPO.class).add(Restrictions.eq("company.cid", company)).add(Restrictions.eq("enabled", status)).add(Restrictions.or(Restrictions.eq("department.did", department), Restrictions.isNull("department.did"))).list();
	}

	@Override
	public boolean queryQuotationAssignConfigForEnable(int company) {

		Number count = (Number) createCriteria(QuotationAssignConfigPO.class).add(Restrictions.eq("company.cid", company)).add(Restrictions.eq("enabled", QuotationAssignConfigPO.ENABLED_ENABLED_INT)).add(Restrictions.eq("autoAssign", QuotationAssignConfigPO.AUTO_ASSIGN_AUTO_INT)).setProjection(Projections.rowCount()).uniqueResult();

		return count != null && count.intValue() > 0;
	}
}

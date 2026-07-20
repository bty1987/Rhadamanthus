/**
 * @File Name		: ActionLogDaoImpl
 * @Package   	: com.fanglin.dao
 * @Version		: 1.0
 * @Date			: 2014-9-21
 * @Copyright	: Copyright Creators 2014
 * @Author		:  bty1987
 * @Email			: 
 * @Describing	: 
 */

package com.fanglin.log.dao.impl;

import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.log.dao.ActionLogDao;
import com.fanglin.log.po.ActionLogPO;
import com.fanglin.utils.Paging;

@Repository("actionLogDao")
public class ActionLogDaoImpl extends DaoImpl<ActionLogPO> implements ActionLogDao {

	public ActionLogDaoImpl() {
		super(ActionLogPO.class);
	}

	@Override
	public List<ActionLogPO> getPageActionLogPOs(Paging paging, List<Filter> filters) {
		PagingQuery<ActionLogPO> query = pagingQuery(paging, ActionLogPO.class);

		queryFilterExcute(query, filters);

		query.desc("createTime");

		return query.list();
	}

	@Override
	public List<ActionLogPO> getAllPageActionLogPOs(List<Filter> filters) {

		PagingQuery<ActionLogPO> query = pagingQuery(new Paging(), ActionLogPO.class);

		queryFilterExcute(query, filters);

		query.desc("createTime");
		query.notPaging();

		return query.list();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		if (filters == null)
			return;

		query.alias("createUserPO", "createUserPO");

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if (!StringUtils.isNotEmpty(data))
				continue;

			if ("createTime".equals(field) && "between".equals(op)) {
				query.timeranges("createTime", "createTime", data);
			} else if ("createTime".equals(field)) {
				query.add(getCriterion("createTime", data, op));
			} else if ("createUser".equals(field)) {
				query.add(getCriterion("createUserPO.currentName", (data), op));
			} else if ("createUserId".equals(field)) {
				query.add(getCriterion("createUserPO.userId", (data), op));
			} else if ("moduleId".equals(field)) {
				// Phase 2: 业务模块过滤（decoration/quotation/customer 等）
				query.add(getCriterion("moduleId", data, op));
			} else if ("businessId".equals(field)) {
				// Phase 2: 业务对象主键过滤（订单号/客户 ID）
				query.add(getCriterion("businessId", data, op));
			} else if ("operateType".equals(field)) {
				// Phase 2: 操作类型过滤（ADD/UPDATE/DELETE/QUERY/EXPORT）
				query.add(getCriterion("operateType", data, op));
			} else if ("resultState".equals(field)) {
				// Phase 2: 结果状态过滤（0成功 1失败 2异常）
				query.add(getCriterion("resultState", data, op));
			} else if ("ip".equals(field)) {
				// Phase 2: 来源 IP 过滤
				query.add(getCriterion("ip", data, op));
			} else if ("actionName".equals(field)) {
				// Phase 2: Action 路由名过滤
				query.add(getCriterion("actionName", data, op));
			} else if ("traceId".equals(field)) {
				// Phase 2: 链路追踪 ID 过滤
				query.add(getCriterion("traceId", data, op));
			} else if ("errorCode".equals(field)) {
				// Phase 2: 错误码过滤
				query.add(getCriterion("errorCode", data, op));
			} else {
				query.add(query.getCriterion(field, (data), op));
			}
		}
	}
}

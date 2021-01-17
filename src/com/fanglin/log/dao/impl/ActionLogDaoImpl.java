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
			} else {
				query.add(query.getCriterion(field, (data), op));
			}
		}
	}
}

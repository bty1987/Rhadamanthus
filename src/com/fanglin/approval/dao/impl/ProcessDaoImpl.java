/**
 * @File Name		: ApprovalDaoImpl.java
 * @Package   	: com.fanglin.approval.dao.impl
 * @Version		: 1.0
 * @Date			: 2015-10-25
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.approval.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.approval.dao.ProcessDao;
import com.fanglin.approval.po.ProcessPO;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

@Repository("processDao")
public class ProcessDaoImpl extends DaoImpl<ProcessPO> implements ProcessDao {

	public ProcessDaoImpl() {
		super(ProcessPO.class);
	}

	@Override
	public List<ProcessPO> pageProcess(Paging paging, List<Filter> filters) {

		PagingQuery<ProcessPO> query = pagingQuery(paging, ProcessPO.class);

		queryFilterExcute(filters, query);

		return query.list();
		
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<ProcessPO> queryProcess() {
		return session().createCriteria(ProcessPO.class).add(Restrictions.eq("status", ProcessPO.STATUS_ENABLED_INT)).list();
	}

	@Override
	public ProcessPO queryProcess(String no) {
		return (ProcessPO) session().createCriteria(ProcessPO.class).add(Restrictions.eq("no", no)).setMaxResults(1).uniqueResult();
	}

	@Override
	public int deleteProcessItem(long pid) {
		
		String sql = "DELETE FROM approval.processitem where pid = :pid";
				
	    return session().createSQLQuery(sql).setLong("pid", pid).executeUpdate();
		
	}
	
	public void queryFilterExcute(List<Filter> filters, PagingQuery<ProcessPO> query) {

		if (filters != null) {
			for (Filter filter : filters) {
				String field = filter.getField();
				String data = filter.getData();
				String op = filter.getOp();
				
				if ("no".equals(field)) {
					query.add(query.getCriterion(field, data, op));
				} else if ("name".equals(field)) {
					query.add(query.getCriterion(field, data, op));
				} else if ("company".equals(field)) {
					query.add(query.getCriterion(field, Integer.valueOf(data), op));
				}else if ("status".equals(filter.getField())) {
			          query.add(Restrictions.eq("status", Short.valueOf(filter.getData())));
		        }
			}
		}
	}

}

package com.fanglin.upgrade.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.upgrade.dao.VersionDao;
import com.fanglin.upgrade.po.VersionPO;
import com.fanglin.utils.Paging;

@Repository("versionDao")
public class VersionDaoImpl extends DaoImpl<VersionPO> implements VersionDao{

	public VersionDaoImpl() {
		super(VersionPO.class);
	}
	
	@Override
	public List<VersionPO> pageVersion(Paging paging, List<Filter> filters) {
		
		PagingQuery<VersionPO> query = pagingQuery(paging, VersionPO.class);

		queryFilterExcute(query, filters);
		
		query.desc("createTime");

		return query.list();
	}

	@Override
	public List<VersionPO> queryVersion(List<Filter> filters) {
		
		PagingQuery<VersionPO> query = pagingQuery(new Paging(),VersionPO.class);

		queryFilterExcute(query, filters);
		
		query.desc("createTime");
		
		query.notPaging();

		return query.list();
		
	}
	
	@Override
	public VersionPO queryVersionByNo(String no) {
		return (VersionPO) session().createCriteria(VersionPO.class).add(Restrictions.eq(VersionPO.COLUMN_NO_STR,no)).uniqueResult();
	}
	
	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {
		
		if(filters != null){
			for(Filter filter: filters){
				
				String field = filter.getField();
				String data = filter.getData();
				String op = filter.getOp();
				
				if(VersionPO.COLUMN_STATUS_STR.equals(field)){
					query.add(query.getCriterion(VersionPO.COLUMN_STATUS_STR, Short.valueOf(data), op));
				}
			}
		}
		
	}

	

}

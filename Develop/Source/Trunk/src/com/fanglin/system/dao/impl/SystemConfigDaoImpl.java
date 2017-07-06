package com.fanglin.system.dao.impl;

import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.hibernate.criterion.MatchMode;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.system.dao.SystemConfigDao;
import com.fanglin.system.po.SystemConfigPO;
import com.fanglin.utils.Paging;

@Repository("systemConfigDao")
public class SystemConfigDaoImpl extends DaoImpl<SystemConfigPO> implements SystemConfigDao{
	
	public SystemConfigDaoImpl(){
		super(SystemConfigPO.class);
	}

	@Override
	public List<SystemConfigPO> pageSystemConfig(Paging paging,List<Filter> filters) {
		
		PagingQuery<SystemConfigPO> query = pagingQuery(paging, SystemConfigPO.class);
		
		queryFilterExcute(query, filters);
		
		query.desc("scid");
		
		return query.list();
	}

	@Override
	public SystemConfigPO querySystemConfigByKey(String key) {
		return (SystemConfigPO)createCriteria(SystemConfigPO.class).add(Restrictions.eq(SystemConfigPO.COLUMN_KEY_STR , key)).uniqueResult();
	}
	
	private void queryFilterExcute(PagingQuery<?> query,List<Filter> filters) {
		if(filters != null){
			for(Filter filter: filters){
				if(StringUtils.isNotEmpty(filter.getData())){				
					if("key".equals(filter.getField())){
						query.add(Restrictions.like("key",(filter.getData()),MatchMode.ANYWHERE));
					}			
				}				
			}				
		}	
	}
}



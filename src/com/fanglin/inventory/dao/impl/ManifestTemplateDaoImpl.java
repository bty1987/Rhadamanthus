/**
 * @File Name		: ManifestTemplateDaoImpl.java
 * @Package   	: com.fanglin.inventory.dao.impl
 * @Version		: 1.0
 * @Date			: 2016-9-19
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.inventory.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.inventory.dao.ManifestTemplateDao;
import com.fanglin.inventory.po.ManifestTemplatePO;
import com.fanglin.utils.Paging;

@Repository("manifestTemplateDao")
public class ManifestTemplateDaoImpl extends DaoImpl<ManifestTemplatePO> implements ManifestTemplateDao {
	
	public ManifestTemplateDaoImpl(){
		super(ManifestTemplatePO.class);
	}

	@Override
	public List<ManifestTemplatePO> pageManifestTemplate(Paging paging, List<Filter> filters,int company) {

		PagingQuery<ManifestTemplatePO> query = pagingQuery(paging, ManifestTemplatePO.class);
		
		query.add(query.getCriterion(ManifestTemplatePO.COLUMN_COMPANY_STR,company,"eq"));
		
		queryFilterExcute(query, filters);
		
		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<ManifestTemplatePO> queryManifestTemplate() {
		return session().createCriteria(ManifestTemplatePO.class).list();
	}

	@Override
	public ManifestTemplatePO queryManifestTemplateByMtid(long mtid) {
		return (ManifestTemplatePO) session().createCriteria(ManifestTemplatePO.class).add(Restrictions.eq(ManifestTemplatePO.COLUMN_MTID_STR, mtid)).setMaxResults(1).uniqueResult();
	}
	
	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters){
		
		if(filters != null){
			for(Filter filter: filters){
				
				String field = filter.getField();
				String data = filter.getData();
				String op = filter.getOp();
				
				if(ManifestTemplatePO.COLUMN_NAME_STR.equals(field)){
					query.add(query.getCriterion(ManifestTemplatePO.COLUMN_NAME_STR, data, op));
				}
			}
		}
	}

}

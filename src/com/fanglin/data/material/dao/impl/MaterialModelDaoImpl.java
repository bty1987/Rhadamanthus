/**
 * @File Name		: MaterialModelDaoImpl.java
 * @Package   	: com.fanglin.dao.impl.material
 * @Version		: 1.0
 * @Date			: 2014-8-15
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.data.material.dao.impl;

import java.util.List;

import org.hibernate.criterion.MatchMode;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.material.dao.MaterialModelDao;
import com.fanglin.data.po.MaterialModelPO;
import com.fanglin.utils.Paging;

@Repository("materialModelDao")
public class MaterialModelDaoImpl extends DaoImpl<MaterialModelPO> implements MaterialModelDao{
	
	public MaterialModelDaoImpl(){
		super(MaterialModelPO.class);
	}

	@Override
	public List<MaterialModelPO> pageMaterialModel(Paging paging, List<Filter> filters,int company){
		
		PagingQuery<MaterialModelPO> query = pagingQuery(paging, MaterialModelPO.class);
		query.add(query.getCriterion("company",company,"eq"));
		queryFilterExcute(query, filters);
		
		return query.list();
	}

	@Override
	public List<MaterialModelPO> pageMaterialModelByBrandIds(Paging paging, List<Filter> filters, List<Long> brandIds){
		
		PagingQuery<MaterialModelPO> query = pagingQuery(paging, MaterialModelPO.class);
		
		query.add(Restrictions.in("brand.bid", brandIds));
		
		queryFilterExcute(query, filters);
		
		return query.list();
	}

	@Override
	public List<MaterialModelPO> queryMaterialModel(List<Filter> filters){
		
		PagingQuery<MaterialModelPO> query = pagingQuery(new Paging(), MaterialModelPO.class);
		
		queryFilterExcute(query, filters);
		query.notPaging();
		
		return query.list();
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<MaterialModelPO> queryMaterialModelByName(String materiModelName, int limit,int company){
		return session().createCriteria(MaterialModelPO.class).add(Restrictions.eq(MaterialModelPO.COLUMN_STATUS_STR, MaterialModelPO.TYPE_ENABLE_INT)).add(Restrictions.eq("company", company)).add(Restrictions.ilike(MaterialModelPO.COLUMN_MATERIALMODELNAME_STR, materiModelName, MatchMode.ANYWHERE)).setMaxResults(limit).list();
	}
	
	@SuppressWarnings("unchecked")
	@Override
	public List<MaterialModelPO> queryMaterialModelsByNo(String materiModelNo, int limit){
		return session().createCriteria(MaterialModelPO.class).add(Restrictions.eq(MaterialModelPO.COLUMN_STATUS_STR, MaterialModelPO.TYPE_ENABLE_INT)).add(Restrictions.ilike(MaterialModelPO.COLUMN_MATERIALMODELNO_STR, materiModelNo, MatchMode.ANYWHERE)).setMaxResults(limit).list();
	}

	@Override
	public MaterialModelPO queryMaterialModelByNo(String materiModelNo,int company){
		return (MaterialModelPO) session().createCriteria(MaterialModelPO.class).add(Restrictions.eq("company", company)).add(Restrictions.eq(MaterialModelPO.COLUMN_MATERIALMODELNO_STR, materiModelNo)).uniqueResult();
	}

	@Override
	public MaterialModelPO queryMaterialModelByNameBrand(String materialModelName, long bId){
		return (MaterialModelPO) session().createCriteria(MaterialModelPO.class)
				.add(Restrictions.eq(MaterialModelPO.COLUMN_MATERIALMODELNAME_STR, materialModelName))
				.add(Restrictions.eq(MaterialModelPO.COLUMN_MATERIALBRANDID_STR, bId))
				.uniqueResult();
	}
	
	@Override
	public MaterialModelPO queryMaterialModelByNoBrand(String materialModelNo, long bId){
		return (MaterialModelPO) session().createCriteria(MaterialModelPO.class)
				.add(Restrictions.eq(MaterialModelPO.COLUMN_MATERIALMODELNO_STR, materialModelNo))
				.add(Restrictions.eq(MaterialModelPO.COLUMN_MATERIALBRANDID_STR, bId))
				.uniqueResult();
	}
	
	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters){
		
		query.alias("brand", "brand");
		query.alias("brand.category", "category");
		
		if(filters != null){
			for(Filter filter: filters){
				
				String field = filter.getField();
				
				if("materialTypeId".equals(field)){
					query.add(query.getCriterion("category.cid", Long.valueOf(filter.getData()), "eq"));
				}else if("materialBrandId".equals(filter.getField())){
					query.add(query.getCriterion("brand.bid", Long.valueOf(filter.getData()), "eq"));
				}else if(MaterialModelPO.COLUMN_MATERIALMODELNAME_STR.equals(field)){
					query.add(query.getCriterion(MaterialModelPO.COLUMN_MATERIALMODELNAME_STR, filter.getData(), filter.getOp()));
				}else if("materialBrandName".equals(field)){
					query.add(query.getCriterion("brand.name", filter.getData(), filter.getOp()));
				}else if(MaterialModelPO.COLUMN_MATERIALMODELNO_STR.equals(field)){
					query.add(query.getCriterion(MaterialModelPO.COLUMN_MATERIALMODELNO_STR, filter.getData(), filter.getOp()));
				}
			}
		}
	}
	
}

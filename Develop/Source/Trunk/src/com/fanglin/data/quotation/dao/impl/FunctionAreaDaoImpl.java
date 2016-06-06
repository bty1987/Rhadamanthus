/**
 * @File Name		: QuotationVersionDaoImpl.java
 * @Package   	: com.fanglin.dao.impl
 * @Version		: 1.0
 * @Date			: 2014-7-25
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.data.quotation.dao.impl;

import java.util.List;

import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.FilterVO;
import com.fanglin.data.quotation.dao.FunctionAreaDao;
import com.fanglin.data.quotation.po.FunctionAreaPO;
import com.fanglin.utils.Paging;

@Repository("functionAreaDao")
public class FunctionAreaDaoImpl extends DaoImpl<FunctionAreaPO> implements FunctionAreaDao {

	public FunctionAreaDaoImpl(){
		super(FunctionAreaPO.class);
	}

	@Override
	public List<FunctionAreaPO> pageFunctionArea(Paging paging, List<FilterVO> filters){
		PagingQuery<FunctionAreaPO> query = pagingQuery(paging, FunctionAreaPO.class);
		
		if(filters != null){
			for(FilterVO filter: filters){
				if("versionId".equals(filter.getField())){
					query.add(query.getCriterion("quotationVersion.versionId", (filter.getData()), filter.getOp()));
				}else{
					query.add(query.getCriterion(filter.getField(), filter.getData(), filter.getOp()));
				}
			}
		}
		
		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<FunctionAreaPO> queryFunctionAreaByVersionId(String versionId){
		return createCriteria(FunctionAreaPO.class)
				.add(Restrictions.eq("quotationVersion.versionId", versionId))
				.addOrder(Order.asc("functionAreaOrder"))
				.list();
	}
	
	@Override
	public FunctionAreaPO queryFunctionAreaByIdAVersionId(String functionAreaId, String versionId){
		return (FunctionAreaPO)session().createCriteria(FunctionAreaPO.class)
				.add(Restrictions.eq("functionAreaId", functionAreaId))
				.add(Restrictions.eq("quotationVersion.versionId", versionId))
				.uniqueResult();
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<FunctionAreaPO> queryFunctionAreaForCommonByVersionId(String versionId){
		return createCriteria(FunctionAreaPO.class)
				.add(Restrictions.not(Restrictions.eq("functionAreaId", "")))
				.add(Restrictions.eq("quotationVersion.versionId", versionId))
				.add(Restrictions.eq("functionAreaType",  "普通"))
				.addOrder(Order.asc("functionAreaOrder"))
				.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<FunctionAreaPO> queryFunctionAreaForSpecialByVersionId(String versionId){
		return createCriteria(FunctionAreaPO.class)
				.add(Restrictions.not(Restrictions.eq("functionAreaId", "")))
				.add(Restrictions.eq("quotationVersion.versionId", versionId))
				.add(Restrictions.ne("functionAreaType", "普通"))
				.addOrder(Order.asc("functionAreaOrder"))
				.list();
	}
	
}

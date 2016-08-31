/**
 * @File Name		: SystemDefineItemDaoImpl.java
 * @Package   	: com.fanglin.dao.impl
 * @Version		: 1.0
 * @Date			: 2014-7-24
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.data.quotation.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.FilterVO;
import com.fanglin.data.po.SystemDefineItemPO;
import com.fanglin.data.quotation.dao.SystemDefineItemDao;
import com.fanglin.utils.Paging;

@Repository("systemDefineItemDao")
public class SystemDefineItemDaoImpl extends DaoImpl<SystemDefineItemPO> implements SystemDefineItemDao {
	
	public SystemDefineItemDaoImpl(){
		super(SystemDefineItemPO.class);
	}

	@Override
	public List<SystemDefineItemPO> pageSystemDefineItem(Paging paging, List<FilterVO> filters){
		
		PagingQuery<SystemDefineItemPO> query = pagingQuery(paging, SystemDefineItemPO.class);
		
		queryFilterExcute(query, filters);
		
		query.asc("itemId");
		
		return query.list();
	}
	
	@Override
	public SystemDefineItemPO querySystemDefineItemById(String itemId){
		return (SystemDefineItemPO)session().createCriteria(SystemDefineItemPO.class).add(Restrictions.eq("itemId", itemId)).uniqueResult();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<FilterVO> filters){
		
		if(filters != null){
			for(FilterVO filter: filters){
				if("quotationBigCategoryId".equals(filter.getField())){
					query.add(query.getCriterion("quotationBigCategory.id", Integer.parseInt(filter.getData()), filter.getOp()));
				}else if("quotationWorkTypeId".equals(filter.getField())){
					query.add(query.getCriterion("workType.id", Integer.parseInt(filter.getData()), filter.getOp()));
				}else if("status".equals(filter.getField())){
					query.add(query.getCriterion("status", Short.parseShort(filter.getData()), filter.getOp()));
				}else{
					query.add(query.getCriterion(filter.getField(), filter.getData(), filter.getOp()));
				}
			}
		}
	}
}

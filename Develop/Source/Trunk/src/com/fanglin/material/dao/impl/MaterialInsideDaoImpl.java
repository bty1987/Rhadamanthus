/**
 * @File Name		: MaterialInsideDaoImpl.java
 * @Package   	: com.fanglin.dao.impl.materialOrder
 * @Version		: 1.0
 * @Date			: 2014-11-18
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.material.dao.impl;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.FilterVO;
import com.fanglin.material.dao.MaterialInsideDao;
import com.fanglin.material.po.MaterialInsidePO;
import com.fanglin.utils.Paging;

@Repository("materialInsideDao")
public class MaterialInsideDaoImpl extends DaoImpl<MaterialInsidePO> implements MaterialInsideDao {
	
	public MaterialInsideDaoImpl(){
		super(MaterialInsidePO.class);
	}
	
	@Override
	public List<MaterialInsidePO> pageMaterialInside(Paging paging, List<FilterVO> filters){
		
		PagingQuery<MaterialInsidePO> query = pagingQuery(paging, MaterialInsidePO.class);
		
		if(filters != null){
			for(FilterVO filter: filters){
				query.add(query.getCriterion(filter.getField(), filter));
			}
		}
		
		return query.list();
	}

}

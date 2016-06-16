/**
 * @File Name		: MaterialOutsideDaoImpl.java
 * @Package   	: com.fanglin.dao.impl.materialOrder
 * @Version		: 1.0
 * @Date			: 2014-11-10
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
import com.fanglin.material.dao.MaterialOutsideDao;
import com.fanglin.material.po.MaterialOutsidePO;
import com.fanglin.utils.Paging;

@Repository("materialOutsideDao")
public class MaterialOutsideDaoImpl extends DaoImpl<MaterialOutsidePO> implements MaterialOutsideDao {
	
	public MaterialOutsideDaoImpl(){
		super(MaterialOutsidePO.class);
	}

	@Override
	public List<MaterialOutsidePO> pageMaterialOutside(Paging paging, List<FilterVO> filters) {
		
		PagingQuery<MaterialOutsidePO> query = pagingQuery(paging, MaterialOutsidePO.class);
		
		if(filters != null){
			for(FilterVO filter: filters){
				
				if(MaterialOutsidePO.COLUMN_STATUS_STR.equals(filter.getField())){
					query.add(query.getCriterion(filter.getField(), Short.valueOf(filter.getData()), filter.getOp()));
				}else{
					query.add(query.getCriterion(filter.getField(), filter));
				}
			}
		}
		
		return query.list();
	}

}

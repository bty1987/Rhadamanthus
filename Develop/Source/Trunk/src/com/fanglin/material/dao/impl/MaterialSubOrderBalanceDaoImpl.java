/**
 * @File Name		: MaterialSubOrderPreBalanceDaoImpl.java
 * @Package   	: com.fanglin.dao.materialOrder.impl
 * @Version		: 1.0
 * @Date			: 2015-4-27
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
import com.fanglin.material.dao.MaterialSubOrderBalanceDao;
import com.fanglin.material.po.MaterialSubOrderBalancePO;
import com.fanglin.utils.Paging;

@Repository("materialSubOrderBalanceDao")
public class MaterialSubOrderBalanceDaoImpl extends DaoImpl<MaterialSubOrderBalancePO> implements MaterialSubOrderBalanceDao {
	
	public MaterialSubOrderBalanceDaoImpl(){
		super(MaterialSubOrderBalancePO.class);
	}

	@Override
	public List<MaterialSubOrderBalancePO> pageMaterialSubOrderBalance(Paging paging, List<FilterVO> filters) {
		
		PagingQuery<MaterialSubOrderBalancePO> query = pagingQuery(paging, MaterialSubOrderBalancePO.class);
		
		queryFilterExecute(query, filters);
		
		return query.list();
	}
	
	private void queryFilterExecute(PagingQuery<?> query, List<FilterVO> filters){
		
	}
	
}

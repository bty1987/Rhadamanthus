/**
 * @File Name		: VillageCountDetailDaoImpl.java
 * @Package   	: com.fanglin.report.dao.impl
 * @Version		: 1.0
 * @Date			: 2016-11-1
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.report.dao.impl;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.FilterVO;
import com.fanglin.report.dao.VillageCountDetailDao;
import com.fanglin.report.po.VillageCountDetailPO;
import com.fanglin.utils.Paging;

@Repository("villageCountDetailDao")
public class VillageCountDetailDaoImpl extends DaoImpl<VillageCountDetailPO> implements VillageCountDetailDao {
	
	public VillageCountDetailDaoImpl(){
		super(VillageCountDetailPO.class);
	}
	
	@Override
	public List<VillageCountDetailPO> pageVillageCountDetail(Paging paging, List<FilterVO> filters) {
		
		PagingQuery<VillageCountDetailPO> query = pagingQuery(paging, VillageCountDetailPO.class);
		
		queryFilterExecute(query, filters);
		
		return query.list();
	}

	@Override
	public List<VillageCountDetailPO> queryVillageCountDetail(List<FilterVO> filters) {

		PagingQuery<VillageCountDetailPO> query = pagingQuery(new Paging(), VillageCountDetailPO.class);	
		
		queryFilterExecute(query, filters);
		
		query.notPaging();
		
		return query.list();
	}
	
	private void queryFilterExecute(PagingQuery<?> query, List<FilterVO> filters){
		
	}

}

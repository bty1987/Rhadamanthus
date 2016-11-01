/**
 * @File Name		: RegionCountDetailDaoImpl.java
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
import com.fanglin.report.dao.RegionCountDetailDao;
import com.fanglin.report.po.RegionCountDetailPO;
import com.fanglin.utils.Paging;

@Repository("regionCountDetailDao")
public class RegionCountDetailDaoImpl extends DaoImpl<RegionCountDetailPO> implements RegionCountDetailDao {
	
	public RegionCountDetailDaoImpl(){
		super(RegionCountDetailPO.class);
	}
	
	@Override
	public List<RegionCountDetailPO> pageRegionCountDetail(Paging paging, List<FilterVO> filters) {
		
		PagingQuery<RegionCountDetailPO> query = pagingQuery(paging, RegionCountDetailPO.class);
		
		queryFilterExecute(query, filters);
		
		return query.list();
	}

	@Override
	public List<RegionCountDetailPO> queryRegionCountDetail(List<FilterVO> filters) {
		
		PagingQuery<RegionCountDetailPO> query = pagingQuery(new Paging(), RegionCountDetailPO.class);
		
		queryFilterExecute(query, filters);
		
		query.notPaging();
		
		return query.list();
	}
	
	private void queryFilterExecute(PagingQuery<?> query, List<FilterVO> filters){
		
	}

}

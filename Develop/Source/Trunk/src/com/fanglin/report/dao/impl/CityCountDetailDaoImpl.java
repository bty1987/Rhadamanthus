/**
 * @File Name		: CityCountDetailDaoImpl.java
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
import com.fanglin.report.dao.CityCountDetailDao;
import com.fanglin.report.po.CityCountDetailPO;
import com.fanglin.utils.Paging;

@Repository("cityCountDetailDao")
public class CityCountDetailDaoImpl extends DaoImpl<CityCountDetailPO> implements CityCountDetailDao {
	
	public CityCountDetailDaoImpl(){
		super(CityCountDetailPO.class);
	}
	
	@Override
	public List<CityCountDetailPO> pageCityCountDetail(Paging paging, List<FilterVO> filters) {
		
		PagingQuery<CityCountDetailPO> query = pagingQuery(new Paging(), CityCountDetailPO.class);
		
		queryFilterExecute(query, filters);
		
		return query.list();
	}

	@Override
	public List<CityCountDetailPO> queryCityCountDetail(List<FilterVO> filters) {
		
		PagingQuery<CityCountDetailPO> query = pagingQuery(new Paging(), CityCountDetailPO.class);
		
		queryFilterExecute(query, filters);
		
		query.notPaging();
		
		return query.list();
	}
	
	private void queryFilterExecute(PagingQuery<?> query, List<FilterVO> filters){
		
	}

}

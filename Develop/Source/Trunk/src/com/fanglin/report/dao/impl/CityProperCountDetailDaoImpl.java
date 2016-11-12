/**
 * @File Name		: CityProperCountDetailDaoImpl.java
 * @Package   	: com.fanglin.report.dao.impl
 * @Version		: 1.0
 * @Date			: 2016-11-1
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.report.dao.impl;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.FilterVO;
import com.fanglin.report.dao.CityProperCountDetailDao;
import com.fanglin.report.po.CityProperCountDetailPO;
import com.fanglin.utils.Paging;

@Repository("cityProperCountDetailDao")
public class CityProperCountDetailDaoImpl extends DaoImpl<CityProperCountDetailPO> implements CityProperCountDetailDao {
	
	public CityProperCountDetailDaoImpl(){
		super(CityProperCountDetailPO.class);
	}
	
	@Override
	public List<CityProperCountDetailPO> pageCityProperCountDetail(Paging paging, List<FilterVO> filters) throws ParseException {
		
		PagingQuery<CityProperCountDetailPO> query = pagingQuery(paging, CityProperCountDetailPO.class);
		
		queryFilterExecute(query, filters);
		
		return query.list();
	}

	@Override
	public List<CityProperCountDetailPO> queryCityProperCountDetail(List<FilterVO> filters) throws ParseException {
		
		PagingQuery<CityProperCountDetailPO> query = pagingQuery(new Paging(), CityProperCountDetailPO.class);
		
		queryFilterExecute(query, filters);
		
		query.notPaging();
		
		return query.list();
	}
	
	private void queryFilterExecute(PagingQuery<?> query, List<FilterVO> filters) throws ParseException{
		
		for(FilterVO filter: filters){
			
			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();
			
			if("createDate".equals(field)){
				Date date = new SimpleDateFormat("yyyy-MM-dd").parse(data);
				query.add(query.getCriterion(field, date, op));
			}
		}
	}

}

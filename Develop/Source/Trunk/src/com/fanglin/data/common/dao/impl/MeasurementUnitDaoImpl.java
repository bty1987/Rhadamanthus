/**
 * @File Name		: MeasurementUnitDaoImpl.java
 * @Package   	: com.fanglin.dao.impl
 * @Version		: 1.0
 * @Date			: 2014-7-29
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.data.common.dao.impl;

import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.dao.MeasurementUnitDao;
import com.fanglin.data.po.MeasurementUnitPO;
import com.fanglin.utils.Paging;

@Repository("measurementunit")
public class MeasurementUnitDaoImpl extends DaoImpl<MeasurementUnitPO> implements 	MeasurementUnitDao {

	public MeasurementUnitDaoImpl(){
		super(MeasurementUnitPO.class, true);
	}

	@Override
	public List<MeasurementUnitPO> pageMeasurementUnit(Paging paging,List<Filter> filters) {
	
		PagingQuery<MeasurementUnitPO> query =pagingQuery(paging,MeasurementUnitPO.class); 
		
		queryFilterExcute(query,filters);
		
		return query.list();
	}

	@Override
	public MeasurementUnitPO queryMeasurementUnitByName(String name) {
		return  (MeasurementUnitPO) createCriteria(MeasurementUnitPO.class).add(Restrictions.eq(MeasurementUnitPO.COLUMN_NAME_STR , name)).uniqueResult();
	}
	
	@Override
	public MeasurementUnitPO queryMeasurementUnitById(int id) {
		return (MeasurementUnitPO) createCriteria(MeasurementUnitPO.class).add(Restrictions.eq(MeasurementUnitPO.COLUMN_ID_STR , id)).uniqueResult();
}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {
		if(filters!=null){
			for(Filter filter:filters){
				if(StringUtils.isNotEmpty(filter.getData())){
					if("name".equals(filter.getField())){
						query.add(query.getCriterion("name",(filter.getData()), filter.getOp()));
					}
				}
			}
		}
	}
}

/**
 * @FileName	: RegionDaoImpl.java
 * @Package   	: com.fanglin.dao.impl
 * @Version		: 1.0
 * @Date		: 2014-7-28
 * @Copyright	: Copyright Decoration 2014
 * @Author		: bty1987
 * @Describing	: 
 */

package com.fanglin.system.dao.impl;

import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.FilterVO;
import com.fanglin.system.dao.RegionDao;
import com.fanglin.system.po.RegionPO;
import com.fanglin.utils.Paging;

@Repository("regionDaoImpl")
public class RegionDaoImpl extends DaoImpl<RegionPO> implements RegionDao {

	public RegionDaoImpl(){
		super(RegionPO.class);
	}

	@Override
	public List<RegionPO> pageRegion(Paging paging, List<FilterVO> filters){

		PagingQuery<RegionPO> query = pagingQuery(paging, RegionPO.class);

		if(filters != null){
			for(FilterVO fv : filters){
				if(StringUtils.isNotEmpty(fv.getData()))
					query.add(query.getCriterion(fv.getField(), fv.getData(), fv.getOp()));
			}
		}

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<RegionPO> queryRegion(){
		return session().createCriteria(RegionPO.class).list();
	}

}

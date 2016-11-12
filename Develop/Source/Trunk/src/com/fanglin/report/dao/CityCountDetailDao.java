/**
 * @File Name		: CityCountDetailDao.java
 * @Package   	: com.fanglin.report.dao
 * @Version		: 1.0
 * @Date			: 2016-11-1
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.report.dao;

import java.text.ParseException;
import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.FilterVO;
import com.fanglin.report.po.CityCountDetailPO;
import com.fanglin.utils.Paging;

public interface CityCountDetailDao extends Dao<CityCountDetailPO> {
	
	public List<CityCountDetailPO> pageCityCountDetail(Paging paging, List<FilterVO> filters) throws ParseException;
	
	public List<CityCountDetailPO> queryCityCountDetail(List<FilterVO> filters) throws ParseException;

}

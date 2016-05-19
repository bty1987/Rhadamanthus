/**
 * @File Name		: MaterialTypeCountDao.java
 * @Package   	: com.fanglin.material.dao
 * @Version		: 1.0
 * @Date			: 2015-5-24
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.report.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.FilterVO;
import com.fanglin.report.po.MaterialTypeCountPO;

public interface MaterialTypeCountDao extends Dao<MaterialTypeCountPO> {
	
	public MaterialTypeCountPO queryMaterialTypeCountByMaterialTypeATime(String materialType, String time);
	
	public List<MaterialTypeCountPO> queryMaterialTypeCount(List<FilterVO> filters);
	
	public List<Object> countMaterialTypeCount(List<FilterVO> filters);

}

/**
 * @File Name		: MaterialBrandCountDao.java
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
import com.fanglin.report.po.MaterialBrandCountPO;

public interface MaterialBrandCountDao extends Dao<MaterialBrandCountPO> {
	
	public MaterialBrandCountPO queryMaterialBrandCountByMaterialBrandATime(String materialBrand, String time);
	
	public List<MaterialBrandCountPO> queryMaterialBrandCount(List<FilterVO> filters);
	
	public List<Object> countMaterialBrandCount(List<FilterVO> filters);

}

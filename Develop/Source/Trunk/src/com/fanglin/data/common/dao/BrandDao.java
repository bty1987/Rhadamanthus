/**
 * @File Name		: BrandDao.java
 * @Package   	: com.fanglin.data.dao
 * @Version		: 1.0
 * @Date			: 2015-11-29
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.data.common.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.po.BrandPO;
import com.fanglin.utils.Paging;

public interface BrandDao extends Dao<BrandPO> {
	
	public List<BrandPO> pageBrand(Paging paging, List<Filter> filters,int company);
	
	public List<BrandPO> pageBrandByBrandNamePinYin(Paging paging, String pinyinName,int company);
	
	public List<BrandPO> queryBrandByCategoryId(long categoryId);
	
	public List<BrandPO> queryBrandByBrandIds(List<String> brandIds);
	
	public BrandPO queryBrandByBId(long bId);
	
	public BrandPO queryBrandByBrandId(String brandId);
	
}

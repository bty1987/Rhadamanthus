/**
 * @File Name		: BrandService.java
 * @Package   	: com.fanglin.data.service
 * @Version		: 1.0
 * @Date			: 2015-11-29
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.data.common.service;

import java.util.List;

import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.vo.BrandVO;
import com.fanglin.utils.Paging;

public interface BrandService {
	
	public void pageBrand(Paging paging, List<Filter> filters,int company);
	
	public List<BrandVO> queryBrand(int company);
	
	public List<BrandVO> queryBrandForPinYinName(String pinyinName,int company);
	
	public BrandVO queryBrandByBId(BrandVO brandVO);
	
	public BrandVO queryBrandByBrandId(BrandVO brandVO);
	
	public List<BrandVO> queryBrandByCategoryId(BrandVO brandVO);
	
	public int addBrand(BrandVO brandVO,int company);
	
	public int updateBrand(BrandVO brandVO);
	
	public int deleteBrandByBId(long bId);
	
	public int deleteBrandByBIds(List<Long> bIds);

}

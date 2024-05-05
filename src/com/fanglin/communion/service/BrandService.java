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

package com.fanglin.communion.service;

import java.util.List;

import com.fanglin.communion.vo.BrandVO;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface BrandService {

	public void pageBrand(Paging paging, List<Filter> filters, int company);

	public List<BrandVO> queryBrand(Integer company);

	public List<BrandVO> queryBrand(BrandVO brandVO, Integer company);

	public BrandVO queryBrandByBid(BrandVO brandVO);

	public BrandVO queryBrandByNo(BrandVO brandVO);

	public List<BrandVO> queryBrandByCid(BrandVO brandVO);

	public int addBrand(BrandVO brandVO, int company);

	public int updateBrand(BrandVO brandVO);

	public int deleteBrand(List<BrandVO> brandVOs);

}

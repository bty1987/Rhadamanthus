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

package com.fanglin.communion.dao;

import java.util.List;

import com.fanglin.communion.po.BrandPO;
import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface BrandDao extends Dao<BrandPO> {

	public List<BrandPO> pageBrand(Paging paging, List<Filter> filters, Integer company);

	public List<BrandPO> pageBrand(Paging paging, String pinyin, Short atttype, Short status, Integer company);

	public List<BrandPO> queryBrandByCid(long cid);

	public BrandPO queryBrandByBid(long bid);

	public BrandPO queryBrandByNo(String no);

	public BrandPO queryBrand(String kino);

}

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

import com.fanglin.communion.po.BrandInstorerPO;
import com.fanglin.core.dao.Dao;

public interface BrandInstorerDao extends Dao<BrandInstorerPO> {

	List<BrandInstorerPO> queryBrandInstorer(long bid);

	List<BrandInstorerPO> queryBrandInstorerByIuid(long iuid);

}

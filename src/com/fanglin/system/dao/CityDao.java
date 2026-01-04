/**
 * @FileName	: CityDao.java
 * @Package   	: com.fanglin.dao
 * @Version		: 1.0
 * @Date		: 2014-8-2
 * @Copyright	: Copyright Decoration 2014
 * @Author		: bty1987
 * @Describing	: 
 */
package com.fanglin.system.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.system.po.CityPO;
import com.fanglin.utils.Paging;

public interface CityDao extends Dao<CityPO> {

	public List<CityPO> pageCity(Paging paging, List<Filter> filters);

	public List<CityPO> pageCityByName(Paging paging, String name);

	public List<CityPO> queryCityByRid(Integer rid);

	public CityPO queryCityByNameAndProvince(String name, String province);

}

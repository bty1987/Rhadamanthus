/**
 * @File Name		: CityProperService.java
 * @Package   	: com.fanglin.service
 * @Version		: 1.0
 * @Date			: 2014-8-8
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.system.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.system.vo.CityProperVO;
import com.fanglin.utils.Paging;

public interface CityProperService {

	public void pageCityProper(Paging paging, List<Filter> filters);

	public List<CityProperVO> queryCityProper();

	public CityProperVO queryCityProperByCpid(CityProperVO cityProperVO);

	public List<CityProperVO> queryCityProperByCid(CityProperVO cityProperVO);

	public List<CityProperVO> queryCityProperByName(CityProperVO cityProperVO);

	public void addCityProper(CityProperVO cityProperVO) throws FLException;

	public void updateCityProper(CityProperVO cityProperVO) throws FLException;

	public int updateCityProperForPosition(CityProperVO cityProperVO) throws FLException;

	public void deleteCityProperByCpid(Integer cpid);

	public String deleteCityProper(List<Integer> cpids);

	/**
	 * 验证城区是否存在，不存在则创建，存在则返回城区信息
	 * @param cityProperVO 包含城区名称和所属城市的VO对象
	 * @return 返回城区信息（已存在或新建的）
	 * @throws FLException
	 */
	public CityProperVO existCity(CityProperVO cityProperVO) throws FLException;

}

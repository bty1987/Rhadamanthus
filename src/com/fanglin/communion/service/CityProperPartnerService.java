package com.fanglin.communion.service;

import java.util.List;

import com.fanglin.communion.vo.CityProperPartnerVO;
import com.fanglin.core.interceptor.FLException;

public interface CityProperPartnerService {

	public List<CityProperPartnerVO> queryCityProperPartner(CityProperPartnerVO cityProperPartner) throws FLException;

	public int addCityProperPartner(CityProperPartnerVO cityProperPartner, int company) throws FLException;

	public int deleteCityProperPartner(CityProperPartnerVO cityProperPartner) throws FLException;

}

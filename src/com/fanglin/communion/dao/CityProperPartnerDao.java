package com.fanglin.communion.dao;

import java.util.List;

import com.fanglin.communion.po.CityProperPartnerPO;
import com.fanglin.core.dao.Dao;

public interface CityProperPartnerDao extends Dao<CityProperPartnerPO> {

	public List<CityProperPartnerPO> queryCityProperPartner(int cpid);

	public CityProperPartnerPO queryCityProperPartner(int cpid, short type);

}

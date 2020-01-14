/**
 * @File Name		: MacontrilDaoImpl.java
 * @Package   	: com.fanglin.factory.dao.impl
 * @Version		: 1.0
 * @Date			: 2018-4-19
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.personel.dao.impl;

import java.math.BigInteger;
import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.personel.dao.MacontrolDao;
import com.fanglin.personel.po.MacontrolPO;

@Repository("macontrolDao")
public class MacontrolDaoImpl extends DaoImpl<MacontrolPO> implements MacontrolDao {

	public MacontrolDaoImpl() {
		super(MacontrolPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<MacontrolPO> queryMacontrol(Long uid) {
		return session().createCriteria(MacontrolPO.class).add(Restrictions.eq("buid", uid)).list();
	}

	@Override
	public int checkMacontrolForMac(Integer uid, List<String> macs) {

		String sql = "select count(*) from communion.macontrol where buid = :uid and mac in :macs and status = 0";
		BigInteger count = (BigInteger) session().createSQLQuery(sql).setInteger("uid", uid).setParameterList("macs", macs).uniqueResult();

		return count.intValue();
	}

	@Override
	public int checkMacontrolForIp(Integer uid, List<String> ips) {

		String sql = "select count(*) from communion.macontrol where buid = :uid and ip in :ips and status = 0";
		BigInteger count = (BigInteger) session().createSQLQuery(sql).setInteger("uid", uid).setParameterList("ips", ips).uniqueResult();

		return count.intValue();
	}

}

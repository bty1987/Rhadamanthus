/**
 * @File Name		: MacontrolDao.java
 * @Package   	: com.fanglin.factory.dao
 * @Version		: 1.0
 * @Date			: 2018-4-19
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.personel.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.personel.po.MacontrolPO;

public interface MacontrolDao extends Dao<MacontrolPO> {

	public List<MacontrolPO> queryMacontrol(Long uid);

	public int checkMacontrolForMac(Integer buid, List<String> macs);

	public int checkMacontrolForIp(Integer buid, List<String> ips);

}

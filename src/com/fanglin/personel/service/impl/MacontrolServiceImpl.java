/**
 * @File Name		: MacontrolServiceImpl.java
 * @Package   	: com.fanglin.factory.service.impl
 * @Version		: 1.0
 * @Date			: 2018-4-19
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.personel.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.personel.dao.MacontrolDao;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.MacontrolPO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.service.MacontrolService;
import com.fanglin.personel.vo.MacontrolVO;
import com.fanglin.utils.BeanUtil;

@Service("macontrolService")
@Transactional(readOnly = true)
public class MacontrolServiceImpl implements MacontrolService {

	@Autowired
	private MacontrolDao macontrolDao;

	@Autowired
	private UserDao userDao;

	@Override
	public List<MacontrolVO> queryMacontrol(MacontrolVO macontrolVO) {

		List<MacontrolPO> macontrolPOs = macontrolDao.queryMacontrol(macontrolVO.getBuid());
		List<MacontrolVO> macontrolVOs = new ArrayList<MacontrolVO>();

		for (MacontrolPO macontrolPO : macontrolPOs) {
			macontrolVO = new MacontrolVO();

			BeanUtil.copyPropertie(macontrolPO, macontrolVO);

			macontrolVOs.add(macontrolVO);
		}

		return macontrolVOs;
	}

	@Override
	public int checkMacontrol(String userId, List<MacontrolVO> macontrols) throws FLException {

		UserPO userPO = userDao.queryUserByUserId(userId);

		if (userPO == null) {
			throw new FLException(190005, "人员不存在");
		}

		List<String> macs = new ArrayList<String>();
		List<String> ips = new ArrayList<String>();

		for (MacontrolVO macontrolVO : macontrols) {
			macs.add(macontrolVO.getMac());
			ips.add(macontrolVO.getIp());
		}

		short extranet = userPO.getExtranet();

		if ((extranet & UserPO.EXTRANET_MAC_INT) == UserPO.EXTRANET_MAC_INT && macontrolDao.checkMacontrolForMac(userPO.getUid(), macs) == 0) {
			throw new FLException(110013, "设备无使用权限");
		}

		if ((extranet & UserPO.EXTRANET_IP_INT) == UserPO.EXTRANET_IP_INT && macontrolDao.checkMacontrolForIp(userPO.getUid(), ips) == 0) {
			throw new FLException(110013, "设备无使用权限");
		}

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addMacontrol(MacontrolVO macontrolVO) {

		MacontrolPO macontrolPO = new MacontrolPO();

		BeanUtil.copyPropertie(macontrolVO, macontrolPO);

		macontrolDao.save(macontrolPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteMacontrol(MacontrolVO macontrolVO) {

		macontrolDao.delete(new MacontrolPO(macontrolVO.getMid()));

		return 0;
	}

	public static void main(String[] args) {
		System.out.println(0 & UserPO.EXTRANET_MAC_INT);
	}
}

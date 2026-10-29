package com.fanglin.elecsign.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fanglin.elecsign.dao.ElecsignAuthDao;
import com.fanglin.elecsign.enums.ElecsignProvider;
import com.fanglin.elecsign.po.ElecsignAuthPO;
import com.fanglin.elecsign.service.ElecsignAuthService;
import com.fanglin.elecsign.vo.ElecsignAuthVO;

@Service("elecsignAuthService")
public class ElecsignAuthServiceImpl implements ElecsignAuthService {

	@Autowired
	private ElecsignAuthDao elecsignAuthDao;

	@Override
	public List<ElecsignAuthVO> queryElecsignAuthByCid(int cid) {

		List<ElecsignAuthVO> authVOs = new ArrayList<ElecsignAuthVO>();

		// 电子签厂商固定两家(1法大大/2e签宝), 逐厂商查认证行; 无行=未注册(status置null, 页面显示"未注册")
		for (short provider : new short[] { ElecsignProvider.FADADA.code(), ElecsignProvider.ESIGN.code() }) {

			ElecsignAuthVO authVO = new ElecsignAuthVO();
			authVO.setProvider(provider);

			try {
				ElecsignAuthPO authPO = elecsignAuthDao.queryElecsignAuthByCidAndProvider(cid, provider);

				if (authPO != null) {
					authVO.setStatus(Short.valueOf(authPO.getStatus()));
				}
			} catch (Exception e) {
				// 认证行查询不可用(新表未建等)按未注册处理, 不阻断页面
			}

			authVOs.add(authVO);
		}

		return authVOs;
	}
}

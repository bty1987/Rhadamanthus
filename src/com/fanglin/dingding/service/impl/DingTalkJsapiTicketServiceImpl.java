/**
 * @File Name		: DJsapiTicketServiceImpl.java
 * @Package   	: com.fanglin.common.service.impl
 * @Version		: 1.0
 * @Date			: 2016-5-2
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	:
 */

package com.fanglin.dingding.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.dingding.dao.DingTalkJsapiTicketDao;
import com.fanglin.dingding.po.DingTalkJsapiTicketPO;
import com.fanglin.dingding.service.DingTalkJsapiTicketService;
import com.fanglin.dingding.vo.DingTalkJsapiTicketVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.FormatUtil;

@Service("dingTalkJsapiTicketService")
@Transactional(readOnly = true)
public class DingTalkJsapiTicketServiceImpl implements DingTalkJsapiTicketService {

	@Autowired
	private DingTalkJsapiTicketDao jsapiTicketDao;

	@Override
	public DingTalkJsapiTicketVO queryJsapiTicket(String company) {

		DingTalkJsapiTicketPO jsapiTicketPO = jsapiTicketDao.queryJsapiTicket(FormatUtil.decodeCompany(company));
		DingTalkJsapiTicketVO jsapiTicketVO = new DingTalkJsapiTicketVO();

		BeanUtil.copyProperties(jsapiTicketPO, jsapiTicketVO);

		return jsapiTicketVO;
	}

}

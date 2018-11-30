package com.fanglin.market.service.impl;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.dingding.utils.HttpHelper;
import com.fanglin.market.dao.CnoticeDao;
import com.fanglin.market.po.CnoticePO;
import com.fanglin.market.service.CnoticeService;
import com.fanglin.market.vo.CnoticeVO;
import com.fanglin.system.dao.SystemConfigDao;
import com.fanglin.system.po.SystemConfigPO;
import com.fanglin.utils.BeanUtil;

@Service("cnoticeService")
@Transactional(readOnly = true)
public class CnoticeServiceImpl implements CnoticeService {
	
	@Autowired
	private CnoticeDao cnoticeDao;
	
	@Autowired
	private SystemConfigDao systemConfigDao;

	@Override
	public List<CnoticeVO> queryCnoticeByUid(CnoticeVO cnotice, short type) {
		
		List<CnoticePO> cnoticePOs = new ArrayList<CnoticePO>();
		
		List<CnoticeVO> cnoticeVOs = new ArrayList<CnoticeVO>();
		
		if (type == CnoticePO.TYPE_SENDER_INT)  cnoticePOs = cnoticeDao.queryCnoticeBySuid(cnotice.getSuid());
		
		else if (type == CnoticePO.TYPE_RECEIVER_INT)  cnoticePOs = cnoticeDao.queryCnoticeByRuid(cnotice.getRuid());
		
		for (CnoticePO cnoticePO : cnoticePOs) {
			
			CnoticeVO cnoticeVO = new CnoticeVO();
			
			BeanUtil.copyProperties(cnoticePO, cnoticeVO);
			
			cnoticeVOs.add(cnoticeVO);
		}
		
		return cnoticeVOs;
	}

	@Override
	public int countCnotice(CnoticeVO cnotice, short type) {
		
		int count = 0;
		
		if (type == CnoticePO.TYPE_SENDER_INT)  count = cnoticeDao.countCnoticeBySuid(cnotice.getSuid(), cnotice.getStatus());
		
		else if (type == CnoticePO.TYPE_RECEIVER_INT)  count = cnoticeDao.countCnoticeByRuid(cnotice.getRuid(), cnotice.getStatus());
		
		return count;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void addCnotice(CnoticeVO cnotice,String unionId) throws FLException {
		
		CnoticePO cnoticePO = new CnoticePO();
		
		BeanUtil.copyProperties(cnotice, cnoticePO);
		
		cnoticeDao.save(cnoticePO);
		
		SystemConfigPO isv = systemConfigDao.querySystemConfig("isv");
		
		String url = String.format("%s/sendNotice.do?notice.unionId=%s&notice.name=%s&notice.phone=%s&notice.content=%s", isv.getValue(), unionId, cnotice.getName(), cnotice.getPhone(), new SimpleDateFormat("yyyy-MM-dd").format(cnotice.getCreateTime()));
		
		HttpHelper.httpGet(url);

	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void deleteCnotice(CnoticeVO cnotice) throws FLException {
		
		CnoticePO cnoticePO = cnoticeDao.get(cnotice.getCnid());
		
		if (cnoticePO == null) return;
		
		cnoticeDao.delete(cnoticePO);
		
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void updateCnoticeStatusByCnid(CnoticeVO cnotice) throws FLException {
		
		CnoticePO cnoticePO = cnoticeDao.get(cnotice.getCnid());
		
		if (cnoticePO == null) return;
		
		cnoticePO.setStatus(cnotice.getStatus());
		
		cnoticeDao.update(cnoticePO);
		
	}

}

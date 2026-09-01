package com.fanglin.camera.service.impl;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.camera.dao.ConstructionCameraAccessDao;
import com.fanglin.camera.dao.ConstructionCameraDao;
import com.fanglin.camera.po.ConstructionCameraAccessPO;
import com.fanglin.camera.po.ConstructionCameraPO;
import com.fanglin.camera.service.ConstructionCameraService;
import com.fanglin.camera.service.provider.CameraProviderService;
import com.fanglin.camera.vo.ConstructionCameraLiveVO;
import com.fanglin.camera.vo.ConstructionCameraVO;
import com.fanglin.construction.dao.ConstructionDao;
import com.fanglin.construction.po.ConstructionPO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.security.AESHelper;
import com.fanglin.core.vo.Filter;
import com.fanglin.system.po.CompanyPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;
import com.fanglin.utils.SystemConfig;

@Service("constructionCameraService")
@Transactional(readOnly = true)
public class ConstructionCameraServiceImpl implements ConstructionCameraService {

	private static final String PROVIDER_YS7_STR = "ys7";

	@Autowired
	private ConstructionCameraDao constructionCameraDao;

	@Autowired
	private ConstructionDao constructionDao;

	@Autowired
	private ConstructionCameraAccessDao constructionCameraAccessDao;

	@Autowired
	private CameraProviderService ys7CameraProviderService;

	@Override
	public void pageConstructionCamera(Paging paging, List<Filter> filters, int company) throws FLException {

		List<ConstructionCameraPO> constructionCameraPOs = constructionCameraDao.pageConstructionCamera(paging, filters, company);
		List<ConstructionCameraVO> constructionCameraVOs = new ArrayList<ConstructionCameraVO>();

		for (ConstructionCameraPO constructionCameraPO : constructionCameraPOs) {
			constructionCameraVOs.add(vo(constructionCameraPO));
		}

		paging.setData(constructionCameraVOs);
	}

	@Override
	public List<ConstructionCameraVO> queryConstructionCameraByOrderId(ConstructionCameraVO constructionCameraVO, int company) throws FLException {

		if (constructionCameraVO == null || constructionCameraVO.getOrderId() == null) throw new FLException(120038, "工程单不存在");

		List<ConstructionCameraPO> constructionCameraPOs = constructionCameraDao.queryConstructionCameraByOrderId(constructionCameraVO.getOrderId(), company);
		List<ConstructionCameraVO> constructionCameraVOs = new ArrayList<ConstructionCameraVO>();

		for (ConstructionCameraPO constructionCameraPO : constructionCameraPOs) {
			constructionCameraVOs.add(vo(constructionCameraPO));
		}

		return constructionCameraVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public ConstructionCameraLiveVO queryConstructionCameraLiveUrl(ConstructionCameraVO constructionCameraVO, String protocol, String viewerId, int company) throws FLException {

		ConstructionCameraPO constructionCameraPO = requireCamera(constructionCameraVO, company);

		if (constructionCameraPO.getOpenLive() != ConstructionCameraPO.OPEN_ENABLE_INT) throw new FLException(120042, "摄像头能力未开启");
		if (!visible(constructionCameraPO)) throw new FLException(120043, "摄像头不在可见时间段");

		try {
			CameraProviderService provider = provider(constructionCameraPO);
			ConstructionCameraLiveVO liveVO = provider.queryLiveUrl(constructionCameraPO, protocol, constructionCameraPO.getCompany());

			try {
				short onlineStatus = provider.queryOnlineStatus(constructionCameraPO, constructionCameraPO.getCompany());
				constructionCameraPO.setOnlineStatus(onlineStatus);
				constructionCameraPO.setUpdateTime(new Timestamp(System.currentTimeMillis()));
				constructionCameraDao.update(constructionCameraPO);
			} catch (FLException e) {
				constructionCameraPO.setUpdateTime(new Timestamp(System.currentTimeMillis()));
				constructionCameraDao.update(constructionCameraPO);
			}

			access(constructionCameraPO, ConstructionCameraAccessPO.ACTION_LIVE_STR, ConstructionCameraAccessPO.RESULT_SUCCESS_INT, viewerId, null);

			return liveVO;
		} catch (FLException e) {
			access(constructionCameraPO, ConstructionCameraAccessPO.ACTION_LIVE_STR, ConstructionCameraAccessPO.RESULT_FAIL_INT, viewerId, e.getErrorMessage());
			throw e;
		}
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addConstructionCamera(ConstructionCameraVO constructionCameraVO, int company) throws FLException {

		if (constructionCameraVO == null || constructionCameraVO.getOrderId() == null) throw new FLException(120038, "工程单不存在");
		if (constructionCameraVO.getDeviceSerial() == null || constructionCameraVO.getDeviceSerial().length() == 0) throw new FLException(120044, "摄像头设备信息不存在");

		String provider = constructionCameraVO.getProvider() == null || constructionCameraVO.getProvider().length() == 0 ? PROVIDER_YS7_STR : constructionCameraVO.getProvider();
		int channelNo = constructionCameraVO.getChannelNo() == null ? 1 : constructionCameraVO.getChannelNo();

		ConstructionPO constructionPO = constructionDao.queryConstructionByOrderId(constructionCameraVO.getOrderId());

		if (constructionPO == null || (company != CompanyPO.TYPE_HEADQUARTER_INT && constructionPO.getDecoration().getCompany() != company)) throw new FLException(120020, "工程信息不存在");

		int cameraCompany = company == CompanyPO.TYPE_HEADQUARTER_INT ? constructionPO.getDecoration().getCompany() : company;

		if (constructionCameraDao.queryConstructionCameraByDevice(provider, constructionCameraVO.getDeviceSerial(), channelNo, cameraCompany) != null) throw new FLException(120041, "摄像头已存在");

		ConstructionCameraPO constructionCameraPO = new ConstructionCameraPO();

		BeanUtil.copyProperties(constructionCameraVO, constructionCameraPO, Arrays.asList("verifyCode", "constructionId", "company"));

		constructionCameraPO.setProvider(provider);
		constructionCameraPO.setChannelNo(channelNo);
		constructionCameraPO.setConstructionId(constructionPO.getCid());
		constructionCameraPO.setStatus(constructionCameraVO.getStatus() == null ? ConstructionCameraPO.STATUS_ENABLE_INT : constructionCameraVO.getStatus());
		constructionCameraPO.setOnlineStatus(ConstructionCameraPO.ONLINE_UNKNOWN_INT);
		constructionCameraPO.setOpenLive(constructionCameraVO.getOpenLive() == null ? ConstructionCameraPO.OPEN_ENABLE_INT : constructionCameraVO.getOpenLive());
		constructionCameraPO.setOpenCapture(constructionCameraVO.getOpenCapture() == null ? ConstructionCameraPO.OPEN_ENABLE_INT : constructionCameraVO.getOpenCapture());
		constructionCameraPO.setOpenPlayback(constructionCameraVO.getOpenPlayback() == null ? ConstructionCameraPO.OPEN_DISABLE_INT : constructionCameraVO.getOpenPlayback());
		constructionCameraPO.setOpenAlbum(constructionCameraVO.getOpenAlbum() == null ? ConstructionCameraPO.OPEN_ENABLE_INT : constructionCameraVO.getOpenAlbum());
		constructionCameraPO.setVisibleStart(constructionCameraVO.getVisibleStart() == null ? "08:00" : constructionCameraVO.getVisibleStart());
		constructionCameraPO.setVisibleEnd(constructionCameraVO.getVisibleEnd() == null ? "18:00" : constructionCameraVO.getVisibleEnd());
		constructionCameraPO.setCompany(cameraCompany);
		constructionCameraPO.setCreateTime(new Timestamp(System.currentTimeMillis()));

		if (constructionCameraVO.getVerifyCode() != null && constructionCameraVO.getVerifyCode().length() != 0) {
			constructionCameraPO.setVerifyCode(AESHelper.encrypt(constructionCameraVO.getVerifyCode(), SystemConfig.getString("encryptKey"), SystemConfig.getString("encryptIv")));
		}

		constructionCameraDao.save(constructionCameraPO);

		constructionCameraVO.setCcid(constructionCameraPO.getCcid());

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateConstructionCamera(ConstructionCameraVO constructionCameraVO, int company) throws FLException {

		ConstructionCameraPO constructionCameraPO = requireCamera(constructionCameraVO, company);

		if (constructionCameraVO.getName() != null) constructionCameraPO.setName(constructionCameraVO.getName());
		if (constructionCameraVO.getVisibleStart() != null) constructionCameraPO.setVisibleStart(constructionCameraVO.getVisibleStart());
		if (constructionCameraVO.getVisibleEnd() != null) constructionCameraPO.setVisibleEnd(constructionCameraVO.getVisibleEnd());
		if (constructionCameraVO.getVerifyCode() != null) constructionCameraPO.setVerifyCode(AESHelper.encrypt(constructionCameraVO.getVerifyCode(), SystemConfig.getString("encryptKey"), SystemConfig.getString("encryptIv")));

		constructionCameraPO.setUpdateTime(new Timestamp(System.currentTimeMillis()));

		constructionCameraDao.update(constructionCameraPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateConstructionCameraForStatus(ConstructionCameraVO constructionCameraVO, int company) throws FLException {

		ConstructionCameraPO constructionCameraPO = requireCamera(constructionCameraVO, company);

		constructionCameraPO.setStatus(constructionCameraVO.getStatus() == null ? ConstructionCameraPO.STATUS_ENABLE_INT : constructionCameraVO.getStatus());
		constructionCameraPO.setUpdateTime(new Timestamp(System.currentTimeMillis()));

		constructionCameraDao.update(constructionCameraPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateConstructionCameraForVisible(ConstructionCameraVO constructionCameraVO, int company) throws FLException {

		ConstructionCameraPO constructionCameraPO = requireCamera(constructionCameraVO, company);

		if (constructionCameraVO.getOpenLive() != null) constructionCameraPO.setOpenLive(constructionCameraVO.getOpenLive());
		if (constructionCameraVO.getOpenCapture() != null) constructionCameraPO.setOpenCapture(constructionCameraVO.getOpenCapture());
		if (constructionCameraVO.getOpenPlayback() != null) constructionCameraPO.setOpenPlayback(constructionCameraVO.getOpenPlayback());
		if (constructionCameraVO.getOpenAlbum() != null) constructionCameraPO.setOpenAlbum(constructionCameraVO.getOpenAlbum());
		if (constructionCameraVO.getVisibleStart() != null) constructionCameraPO.setVisibleStart(constructionCameraVO.getVisibleStart());
		if (constructionCameraVO.getVisibleEnd() != null) constructionCameraPO.setVisibleEnd(constructionCameraVO.getVisibleEnd());

		constructionCameraPO.setUpdateTime(new Timestamp(System.currentTimeMillis()));

		constructionCameraDao.update(constructionCameraPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteConstructionCamera(ConstructionCameraVO constructionCameraVO, int company) throws FLException {

		ConstructionCameraPO constructionCameraPO = requireCamera(constructionCameraVO, company);

		constructionCameraPO.setStatus(ConstructionCameraPO.STATUS_DISABLE_INT);
		constructionCameraPO.setUpdateTime(new Timestamp(System.currentTimeMillis()));

		constructionCameraDao.update(constructionCameraPO);

		return 0;
	}

	private ConstructionCameraPO requireCamera(ConstructionCameraVO constructionCameraVO, int company) throws FLException {

		if (constructionCameraVO == null || constructionCameraVO.getCcid() == null) throw new FLException(120044, "摄像头设备信息不存在");

		ConstructionCameraPO constructionCameraPO = constructionCameraDao.queryConstructionCameraByCcid(constructionCameraVO.getCcid(), company);

		if (constructionCameraPO == null || constructionCameraPO.getStatus() == ConstructionCameraPO.STATUS_DISABLE_INT) throw new FLException(120044, "摄像头设备信息不存在");

		return constructionCameraPO;
	}

	private ConstructionCameraVO vo(ConstructionCameraPO constructionCameraPO) {

		ConstructionCameraVO constructionCameraVO = new ConstructionCameraVO();

		BeanUtil.copyProperties(constructionCameraPO, constructionCameraVO, Arrays.asList("verifyCode"));

		return constructionCameraVO;
	}

	private CameraProviderService provider(ConstructionCameraPO constructionCameraPO) throws FLException {

		if (PROVIDER_YS7_STR.equals(constructionCameraPO.getProvider())) return ys7CameraProviderService;

		throw new FLException(120045, "摄像头厂商配置不存在");
	}

	private boolean visible(ConstructionCameraPO constructionCameraPO) {

		String visibleStart = constructionCameraPO.getVisibleStart();
		String visibleEnd = constructionCameraPO.getVisibleEnd();

		if (visibleStart == null || visibleEnd == null) return true;

		String current = new SimpleDateFormat("HH:mm").format(new Date());

		if (visibleStart.compareTo(visibleEnd) <= 0) return current.compareTo(visibleStart) >= 0 && current.compareTo(visibleEnd) <= 0;

		return current.compareTo(visibleStart) >= 0 || current.compareTo(visibleEnd) <= 0;
	}

	private void access(ConstructionCameraPO constructionCameraPO, String action, short result, String viewerId, String message) {

		ConstructionCameraAccessPO accessPO = new ConstructionCameraAccessPO();

		accessPO.setOrderId(constructionCameraPO.getOrderId());
		accessPO.setCameraId(constructionCameraPO.getCcid());
		accessPO.setViewerType(ConstructionCameraAccessPO.VIEWER_TYPE_USER_INT);
		accessPO.setViewerId(viewerId);
		accessPO.setAction(action);
		accessPO.setResult(result);
		accessPO.setMessage(message);
		accessPO.setCreateTime(new Timestamp(System.currentTimeMillis()));

		constructionCameraAccessDao.save(accessPO);
	}

}

package com.fanglin.camera.service.impl;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.camera.dao.ConstructionCameraAccessDao;
import com.fanglin.camera.dao.ConstructionCameraDao;
import com.fanglin.camera.dao.ConstructionCameraMediaDao;
import com.fanglin.camera.po.ConstructionCameraAccessPO;
import com.fanglin.camera.po.ConstructionCameraMediaPO;
import com.fanglin.camera.po.ConstructionCameraPO;
import com.fanglin.camera.service.ConstructionCameraMediaService;
import com.fanglin.camera.service.provider.CameraProviderService;
import com.fanglin.camera.vo.ConstructionCameraMediaVO;
import com.fanglin.camera.vo.ConstructionCameraPlayVO;
import com.fanglin.camera.vo.ConstructionCameraVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;

@Service("constructionCameraMediaService")
@Transactional(readOnly = true)
public class ConstructionCameraMediaServiceImpl implements ConstructionCameraMediaService {

	private static final String PROVIDER_YS7_STR = "ys7";

	@Autowired
	private ConstructionCameraDao constructionCameraDao;

	@Autowired
	private ConstructionCameraMediaDao constructionCameraMediaDao;

	@Autowired
	private ConstructionCameraAccessDao constructionCameraAccessDao;

	@Autowired
	private CameraProviderService ys7CameraProviderService;

	@Override
	public List<ConstructionCameraMediaVO> queryConstructionCameraMedia(ConstructionCameraMediaVO constructionCameraMediaVO, String startTime, String endTime, int company) throws FLException {

		if (constructionCameraMediaVO == null || constructionCameraMediaVO.getOrderId() == null) throw new FLException(120038, "工程单不存在");

		List<ConstructionCameraMediaPO> constructionCameraMediaPOs = constructionCameraMediaDao.queryConstructionCameraMedia(constructionCameraMediaVO.getOrderId(), constructionCameraMediaVO.getCameraId(), timestamp(startTime), timestamp(endTime), constructionCameraMediaVO.getCsid(), constructionCameraMediaVO.getSource(), constructionCameraMediaVO.getVisible(), company);
		List<ConstructionCameraMediaVO> constructionCameraMediaVOs = new ArrayList<ConstructionCameraMediaVO>();

		for (ConstructionCameraMediaPO constructionCameraMediaPO : constructionCameraMediaPOs) {
			constructionCameraMediaVOs.add(vo(constructionCameraMediaPO));
		}

		return constructionCameraMediaVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public List<ConstructionCameraMediaVO> queryConstructionCameraPlayList(ConstructionCameraPlayVO constructionCameraPlayVO, String orderId, String startTime, String endTime, String viewerId, int company) throws FLException {

		if (orderId == null) throw new FLException(120038, "工程单不存在");

		Long cameraId = constructionCameraPlayVO == null ? null : constructionCameraPlayVO.getCameraId();
		List<ConstructionCameraMediaVO> constructionCameraMediaVOs = new ArrayList<ConstructionCameraMediaVO>();

		if (cameraId != null) {
			ConstructionCameraPO constructionCameraPO = requireCamera(cameraId, company);

			if (!orderId.equals(constructionCameraPO.getOrderId())) throw new FLException(120044, "摄像头设备信息不存在");
			if (constructionCameraPO.getOpenAlbum() != ConstructionCameraPO.OPEN_ENABLE_INT) throw new FLException(120042, "摄像头能力未开启");
			if (!visible(constructionCameraPO)) throw new FLException(120043, "摄像头不在可见时间段");
		}

		try {
			List<ConstructionCameraMediaPO> medias = constructionCameraMediaDao.queryConstructionCameraMedia(orderId, cameraId, timestamp(startTime), timestamp(endTime), null, null, ConstructionCameraMediaPO.VISIBLE_ENABLE_INT, company);
			List<ConstructionCameraMediaPO> selected = sample(albumMedias(medias, orderId, company), constructionCameraPlayVO == null || constructionCameraPlayVO.getCount() == null ? 20 : constructionCameraPlayVO.getCount());

			for (ConstructionCameraMediaPO media : selected) {
				constructionCameraMediaVOs.add(vo(media));
			}

			access(orderId, cameraId == null ? 0 : cameraId, ConstructionCameraAccessPO.ACTION_ALBUM_STR, ConstructionCameraAccessPO.RESULT_SUCCESS_INT, viewerId, null);
		} catch (FLException e) {
			access(orderId, cameraId == null ? 0 : cameraId, ConstructionCameraAccessPO.ACTION_ALBUM_STR, ConstructionCameraAccessPO.RESULT_FAIL_INT, viewerId, e.getErrorMessage());
			throw e;
		}

		return constructionCameraMediaVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public ConstructionCameraMediaVO captureConstructionCamera(ConstructionCameraVO constructionCameraVO, ConstructionCameraMediaVO constructionCameraMediaVO, String viewerId, int company) throws FLException {

		ConstructionCameraPO constructionCameraPO = requireCamera(constructionCameraVO, company);

		if (constructionCameraPO.getOpenCapture() != ConstructionCameraPO.OPEN_ENABLE_INT) throw new FLException(120042, "摄像头能力未开启");

		try {
			String picUrl = provider(constructionCameraPO).capture(constructionCameraPO, constructionCameraPO.getCompany());

			ConstructionCameraMediaPO mediaPO = new ConstructionCameraMediaPO();

			mediaPO.setOrderId(constructionCameraPO.getOrderId());
			mediaPO.setConstructionId(constructionCameraPO.getConstructionId());
			mediaPO.setCameraId(constructionCameraPO.getCcid());
			mediaPO.setCsid(constructionCameraMediaVO == null || constructionCameraMediaVO.getCsid() == null ? 0 : constructionCameraMediaVO.getCsid());
			mediaPO.setCnid(constructionCameraMediaVO == null || constructionCameraMediaVO.getCnid() == null ? 0 : constructionCameraMediaVO.getCnid());
			mediaPO.setMediaType(ConstructionCameraMediaPO.MEDIA_TYPE_IMAGE_INT);
			mediaPO.setSource(constructionCameraMediaVO == null || constructionCameraMediaVO.getSource() == null ? ConstructionCameraMediaPO.SOURCE_USER_INT : constructionCameraMediaVO.getSource());
			mediaPO.setOriginUrl(picUrl);
			mediaPO.setMediaUrl(picUrl);
			mediaPO.setCoverUrl(picUrl);
			mediaPO.setCaptureTime(new Timestamp(System.currentTimeMillis()));
			mediaPO.setVisible(constructionCameraMediaVO == null || constructionCameraMediaVO.getVisible() == null ? ConstructionCameraMediaPO.VISIBLE_ENABLE_INT : constructionCameraMediaVO.getVisible());
			mediaPO.setStatus(ConstructionCameraMediaPO.STATUS_ENABLE_INT);
			mediaPO.setCompany(constructionCameraPO.getCompany());
			mediaPO.setCreateTime(new Timestamp(System.currentTimeMillis()));

			constructionCameraMediaDao.save(mediaPO);

			access(constructionCameraPO, ConstructionCameraAccessPO.ACTION_CAPTURE_STR, ConstructionCameraAccessPO.RESULT_SUCCESS_INT, viewerId, null);

			return vo(mediaPO);
		} catch (FLException e) {
			access(constructionCameraPO, ConstructionCameraAccessPO.ACTION_CAPTURE_STR, ConstructionCameraAccessPO.RESULT_FAIL_INT, viewerId, e.getErrorMessage());
			throw e;
		}
	}

	private ConstructionCameraPO requireCamera(ConstructionCameraVO constructionCameraVO, int company) throws FLException {

		if (constructionCameraVO == null || constructionCameraVO.getCcid() == null) throw new FLException(120044, "摄像头设备信息不存在");

		return requireCamera(constructionCameraVO.getCcid(), company);
	}

	private ConstructionCameraPO requireCamera(long cameraId, int company) throws FLException {

		ConstructionCameraPO constructionCameraPO = constructionCameraDao.queryConstructionCameraByCcid(cameraId, company);

		if (constructionCameraPO == null || constructionCameraPO.getStatus() == ConstructionCameraPO.STATUS_DISABLE_INT) throw new FLException(120044, "摄像头设备信息不存在");

		return constructionCameraPO;
	}

	private ConstructionCameraMediaVO vo(ConstructionCameraMediaPO constructionCameraMediaPO) {

		ConstructionCameraMediaVO constructionCameraMediaVO = new ConstructionCameraMediaVO();

		BeanUtil.copyProperties(constructionCameraMediaPO, constructionCameraMediaVO);

		return constructionCameraMediaVO;
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

	private Timestamp timestamp(String time) {

		if (time == null || time.length() == 0) return null;

		Date date = DateUtil.parseDate(time, "yyyy-MM-dd HH:mm:ss");

		return date == null ? null : DateUtil.getDateToTimestamp(date);
	}

	private List<ConstructionCameraMediaPO> albumMedias(List<ConstructionCameraMediaPO> medias, String orderId, int company) {

		List<ConstructionCameraMediaPO> albumMedias = new ArrayList<ConstructionCameraMediaPO>();
		Map<Long, ConstructionCameraPO> cameras = new HashMap<Long, ConstructionCameraPO>();

		if (medias == null) return albumMedias;

		for (ConstructionCameraMediaPO media : medias) {

			Long cameraId = media.getCameraId();
			ConstructionCameraPO cameraPO = cameras.get(cameraId);

			if (!cameras.containsKey(cameraId)) {
				cameraPO = constructionCameraDao.queryConstructionCameraByCcid(cameraId, company);
				cameras.put(cameraId, cameraPO);
			}

			if (cameraPO == null || cameraPO.getStatus() == ConstructionCameraPO.STATUS_DISABLE_INT) continue;
			if (!orderId.equals(cameraPO.getOrderId())) continue;
			if (cameraPO.getOpenAlbum() != ConstructionCameraPO.OPEN_ENABLE_INT) continue;
			if (!visible(cameraPO)) continue;

			albumMedias.add(media);
		}

		return albumMedias;
	}

	private List<ConstructionCameraMediaPO> sample(List<ConstructionCameraMediaPO> medias, int limit) {

		if (medias == null || medias.size() <= limit) return medias;
		if (limit <= 0) return new ArrayList<ConstructionCameraMediaPO>();
		if (limit == 1) return medias.subList(0, 1);

		List<ConstructionCameraMediaPO> selected = new ArrayList<ConstructionCameraMediaPO>();
		int size = medias.size();

		for (int i = 0; i < limit; i++) {
			int index = Math.round(i * (size - 1) / (float) (limit - 1));
			selected.add(medias.get(index));
		}

		return selected;
	}

	private void access(ConstructionCameraPO constructionCameraPO, String action, short result, String viewerId, String message) {

		access(constructionCameraPO.getOrderId(), constructionCameraPO.getCcid(), action, result, viewerId, message);
	}

	private void access(String orderId, long cameraId, String action, short result, String viewerId, String message) {

		ConstructionCameraAccessPO accessPO = new ConstructionCameraAccessPO();

		accessPO.setOrderId(orderId);
		accessPO.setCameraId(cameraId);
		accessPO.setViewerType(ConstructionCameraAccessPO.VIEWER_TYPE_USER_INT);
		accessPO.setViewerId(viewerId);
		accessPO.setAction(action);
		accessPO.setResult(result);
		accessPO.setMessage(message);
		accessPO.setCreateTime(new Timestamp(System.currentTimeMillis()));

		constructionCameraAccessDao.save(accessPO);
	}

}

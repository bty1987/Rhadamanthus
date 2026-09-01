package com.fanglin.camera.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;
import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "cameramedia", catalog = "construction")
public class ConstructionCameraMediaPO implements Serializable {

	private static final long serialVersionUID = 7862919193894741707L;

	public static final String COLUMN_CCMID_STR = "ccmid";

	public static final String COLUMN_ORDERID_STR = "orderId";

	public static final String COLUMN_CONSTRUCTIONID_STR = "constructionId";

	public static final String COLUMN_CAMERAID_STR = "cameraId";

	public static final String COLUMN_CAPTURETIME_STR = "captureTime";

	public static final String COLUMN_VISIBLE_STR = "visible";

	public static final String COLUMN_STATUS_STR = "status";

	public static final short MEDIA_TYPE_IMAGE_INT = 1;

	public static final short MEDIA_TYPE_VIDEO_INT = 2;

	public static final short SOURCE_SYSTEM_INT = 0;

	public static final short SOURCE_CUSTOMER_INT = 1;

	public static final short SOURCE_USER_INT = 2;

	public static final short SOURCE_SCHEDULE_INT = 3;

	public static final short SOURCE_NODE_INT = 4;

	public static final short SOURCE_ALARM_INT = 5;

	public static final short VISIBLE_DISABLE_INT = 0;

	public static final short VISIBLE_ENABLE_INT = 1;

	public static final short STATUS_DISABLE_INT = 0;

	public static final short STATUS_ENABLE_INT = 1;

	private long ccmid;

	private String orderId;

	private long constructionId;

	private long cameraId;

	private long csid;

	private long cnid;

	private short mediaType;

	private short source;

	private String originUrl;

	private String mediaUrl;

	private String coverUrl;

	private Timestamp captureTime;

	private short visible;

	private short status;

	private int company;

	private Timestamp createTime;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "ccmid")
	public long getCcmid() {
		return ccmid;
	}

	public void setCcmid(long ccmid) {
		this.ccmid = ccmid;
	}

	@Column(name = "orderId")
	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	@Column(name = "constructionId")
	public long getConstructionId() {
		return constructionId;
	}

	public void setConstructionId(long constructionId) {
		this.constructionId = constructionId;
	}

	@Column(name = "cameraId")
	public long getCameraId() {
		return cameraId;
	}

	public void setCameraId(long cameraId) {
		this.cameraId = cameraId;
	}

	@Column(name = "csid")
	public long getCsid() {
		return csid;
	}

	public void setCsid(long csid) {
		this.csid = csid;
	}

	@Column(name = "cnid")
	public long getCnid() {
		return cnid;
	}

	public void setCnid(long cnid) {
		this.cnid = cnid;
	}

	@Column(name = "mediaType")
	public short getMediaType() {
		return mediaType;
	}

	public void setMediaType(short mediaType) {
		this.mediaType = mediaType;
	}

	@Column(name = "source")
	public short getSource() {
		return source;
	}

	public void setSource(short source) {
		this.source = source;
	}

	@Column(name = "originUrl")
	public String getOriginUrl() {
		return originUrl;
	}

	public void setOriginUrl(String originUrl) {
		this.originUrl = originUrl;
	}

	@Column(name = "mediaUrl")
	public String getMediaUrl() {
		return mediaUrl;
	}

	public void setMediaUrl(String mediaUrl) {
		this.mediaUrl = mediaUrl;
	}

	@Column(name = "coverUrl")
	public String getCoverUrl() {
		return coverUrl;
	}

	public void setCoverUrl(String coverUrl) {
		this.coverUrl = coverUrl;
	}

	@Column(name = "captureTime")
	public Timestamp getCaptureTime() {
		return captureTime;
	}

	public void setCaptureTime(Timestamp captureTime) {
		this.captureTime = captureTime;
	}

	@Column(name = "visible")
	public short getVisible() {
		return visible;
	}

	public void setVisible(short visible) {
		this.visible = visible;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@Column(name = "company")
	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}

	@Column(name = "createTime")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

}

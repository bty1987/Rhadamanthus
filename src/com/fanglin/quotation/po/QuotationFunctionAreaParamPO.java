package com.fanglin.quotation.po;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "quotationfunctionareaparam", catalog = "quotation")
public class QuotationFunctionAreaParamPO implements Serializable {

	private static final long serialVersionUID = -5341807191069264390L;

	public static final String COLUMN_QFAID_STR = "qfaid";

	private long qfapid;

	private long qfaid;

	private int girth;

	private int area;

	private int height;

	private int holeLength;

	private int holeHeight;

	private int windowLength;

	private int windowHeight;

	private int beamLength;

	private int beamHeight;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "qfapid")
	public long getQfapid() {
		return qfapid;
	}

	public void setQfapid(long qfapid) {
		this.qfapid = qfapid;
	}

	@Column(name = "qfaid")
	public long getQfaid() {
		return qfaid;
	}

	public void setQfaid(long qfaid) {
		this.qfaid = qfaid;
	}

	@Column(name = "girth")
	public int getGirth() {
		return girth;
	}

	public void setGirth(int girth) {
		this.girth = girth;
	}

	@Column(name = "area")
	public int getArea() {
		return area;
	}

	public void setArea(int area) {
		this.area = area;
	}

	@Column(name = "height")
	public int getHeight() {
		return height;
	}

	public void setHeight(int height) {
		this.height = height;
	}

	@Column(name = "holeLength")
	public int getHoleLength() {
		return holeLength;
	}

	public void setHoleLength(int holeLength) {
		this.holeLength = holeLength;
	}

	@Column(name = "holeHeight")
	public int getHoleHeight() {
		return holeHeight;
	}

	public void setHoleHeight(int holeHeight) {
		this.holeHeight = holeHeight;
	}

	@Column(name = "windowLength")
	public int getWindowLength() {
		return windowLength;
	}

	public void setWindowLength(int windowLength) {
		this.windowLength = windowLength;
	}

	@Column(name = "windowHeight")
	public int getWindowHeight() {
		return windowHeight;
	}

	public void setWindowHeight(int windowHeight) {
		this.windowHeight = windowHeight;
	}

	@Column(name = "beamLength")
	public int getBeamLength() {
		return beamLength;
	}

	public void setBeamLength(int beamLength) {
		this.beamLength = beamLength;
	}

	@Column(name = "beamHeight")
	public int getBeamHeight() {
		return beamHeight;
	}

	public void setBeamHeight(int beamHeight) {
		this.beamHeight = beamHeight;
	}

}
